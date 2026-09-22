"""
PharmnEx — FastAPI Main Application
────────────────────────────────────
Single-process app: business logic + blockchain calls + ML inference.
No separate microservice hop.
"""
import json
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.database import init_db
from app.ml.registry import load_all_models
from app.routers import auth, batches, admin

settings = get_settings()

# ─── WebSocket connection manager ────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active_connections.append(ws)

    def disconnect(self, ws: WebSocket):
        self.active_connections.remove(ws)

    async def broadcast(self, message: dict):
        dead = []
        for ws in self.active_connections:
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.active_connections.remove(ws)


ws_manager = ConnectionManager()


# ─── Lifespan (startup/shutdown) ─────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    # Startup
    print("[STARTUP] PharmnEx API starting up...")
    await init_db()
    load_all_models()
    print("[OK] Database initialized")
    yield
    # Shutdown
    print("[SHUTDOWN] PharmnEx API shutting down...")


# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="PharmnEx API",
    description=(
        "Blockchain + ML Pharmaceutical Supply Chain Intelligence Platform. "
        "6 roles: Admin, Supplier, Manufacturer, Wholesaler, Distributor, Customer. "
        "Algorand TestNet blockchain + Isolation Forest / XGBoost / SHAP ML layer."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(batches.router)
app.include_router(admin.router)


# ─── Additional inline routers ────────────────────────────────────────────────
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, get_current_user
from app.models.participant import Participant, ParticipantRole
from app.models.materials import RawMaterial, Medicine
from app.models.supply_chain import Order, OrderStatus
from app.schemas.supply_chain import (
    RawMaterialCreate, RawMaterialResponse,
    MedicineCreate, MedicineResponse,
    OrderCreate, OrderResponse, OrderStatusUpdate,
)
from app.core.deps import require_role

# Raw materials
rm_router = APIRouter(prefix="/raw-materials", tags=["Raw Materials"])

@rm_router.post("", response_model=RawMaterialResponse, status_code=201)
async def create_raw_material(
    data: RawMaterialCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(require_role(ParticipantRole.SUPPLIER)),
):
    rm = RawMaterial(supplier_id=current_user.id, **data.model_dump())
    db.add(rm)
    await db.commit()
    await db.refresh(rm)
    return rm

@rm_router.get("", response_model=list[RawMaterialResponse])
async def list_raw_materials(
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_user),
):
    result = await db.execute(select(RawMaterial).where(RawMaterial.supplier_id == current_user.id))
    return result.scalars().all()

app.include_router(rm_router)

# Medicines
med_router = APIRouter(prefix="/medicines", tags=["Medicines"])

@med_router.post("", response_model=MedicineResponse, status_code=201)
async def create_medicine(
    data: MedicineCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(require_role(ParticipantRole.MANUFACTURER)),
):
    medicine = Medicine(manufacturer_id=current_user.id, **data.model_dump())
    db.add(medicine)
    await db.commit()
    await db.refresh(medicine)
    return medicine

@med_router.get("", response_model=list[MedicineResponse])
async def list_medicines(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Medicine))
    return result.scalars().all()

app.include_router(med_router)

# Orders
order_router = APIRouter(prefix="/orders", tags=["Orders"])

@order_router.post("", response_model=OrderResponse, status_code=201)
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_user),
):
    order = Order(buyer_id=current_user.id, **data.model_dump())
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order

@order_router.get("", response_model=list[OrderResponse])
async def list_orders(
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_user),
):
    result = await db.execute(
        select(Order).where(
            (Order.buyer_id == current_user.id) | (Order.seller_id == current_user.id)
        )
    )
    return result.scalars().all()

@order_router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_user),
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.seller_id != current_user.id and order.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your order")
    order.status = data.status
    if data.quantity_received:
        order.quantity_received = data.quantity_received
    await db.commit()
    await db.refresh(order)
    return order

app.include_router(order_router)

# ML endpoints
ml_router = APIRouter(prefix="/ml", tags=["ML Intelligence"])

@ml_router.get("/fraud/score/{transaction_id}")
async def get_fraud_score(
    transaction_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_user),
):
    from app.models.ml_models import MLFraudScore
    result = await db.execute(
        select(MLFraudScore).where(MLFraudScore.transaction_id == transaction_id)
    )
    scores = result.scalars().all()
    if not scores:
        return {"message": "No scores found", "transaction_id": transaction_id}
    return scores

@ml_router.get("/counterfeit/score/{batch_id}")
async def get_counterfeit_score(
    batch_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_user),
):
    from app.models.ml_models import MLCounterfeitScore
    result = await db.execute(
        select(MLCounterfeitScore).where(MLCounterfeitScore.batch_id == batch_id)
    )
    scores = result.scalars().all()
    return scores

@ml_router.get("/demand/forecast")
async def get_demand_forecast(
    medicine_id: int | None = None,
    region: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_user),
):
    from app.ml.registry import demand_registry
    return demand_registry.forecast(medicine_id or 1, region or "India", 30)

app.include_router(ml_router)

# Verify (public)
verify_router = APIRouter(prefix="/verify", tags=["Public Verify"])

@verify_router.get("/{batch_code}")
async def verify_batch(batch_code: str, db: AsyncSession = Depends(get_db)):
    # Delegates to batch router logic
    from app.routers.batches import verify_by_code
    return await verify_by_code(batch_code, db)

app.include_router(verify_router)


# ─── WebSocket endpoint ───────────────────────────────────────────────────────

@app.websocket("/ws/admin/alerts")
async def admin_alerts_ws(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


# ─── Health check ─────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}
