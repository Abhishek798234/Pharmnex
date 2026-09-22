from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, get_current_user
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.models.participant import Participant, ParticipantRole
from app.schemas.auth import ParticipantCreate, ParticipantLogin, TokenResponse, ParticipantResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=ParticipantResponse, status_code=status.HTTP_201_CREATED)
async def register(data: ParticipantCreate, db: AsyncSession = Depends(get_db)):
    """Register a new participant. Admin creates supply-chain roles; customers self-register."""
    result = await db.execute(select(Participant).where(Participant.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    participant = Participant(
        name=data.name,
        email=data.email,
        password_hash=get_password_hash(data.password),
        role=data.role,
        organization=data.organization,
        phone=data.phone,
    )
    db.add(participant)
    await db.commit()
    await db.refresh(participant)
    return participant


@router.post("/login", response_model=TokenResponse)
async def login(data: ParticipantLogin, db: AsyncSession = Depends(get_db)):
    """Login and receive JWT access + refresh tokens."""
    result = await db.execute(select(Participant).where(Participant.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")

    token_data = {"sub": str(user.id), "role": user.role.value, "email": user.email}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=ParticipantResponse.model_validate(user),
    )


@router.get("/me", response_model=ParticipantResponse)
async def get_me(current_user: Participant = Depends(get_current_user)):
    return current_user
