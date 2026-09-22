# PharmnEx — Pharmaceutical Supply Chain Intelligence Platform

PharmnEx is an AI-powered, blockchain-backed pharmaceutical supply chain platform featuring role portals for **Admin, Supplier, Manufacturer, Wholesaler, Distributor, and Customer**, with real-time QR batch verification, ML anomaly detection, and synthetic supply chain experiment labs.

---

## 🚀 How to Run the Project

The application consists of two parts:
1. **Backend**: FastAPI REST & WebSocket server (`http://localhost:8000`)
2. **Frontend**: Next.js 16 + React 19 UI (`http://localhost:3000`)

---

### Option A: Using the 1-Click Batch Scripts (Windows)

1. Double-click `run_backend.bat` to launch the FastAPI server.
2. Double-click `run_frontend.bat` to launch the Next.js frontend.
3. Open your browser to [http://localhost:3000](http://localhost:3000).

---

### Option B: Using the Terminal / PowerShell

#### 1. Start the Backend (Terminal 1)

```powershell
cd "pharmnex/apps/api"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- Backend API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Interactive Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Interactive ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

#### 2. Start the Frontend (Terminal 2)

```powershell
cd "pharmnex/apps/web"
npm run dev
```

- Web App: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Login Accounts

All test accounts are pre-seeded in the database:

| Role | Email | Password | Portal URL |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pharmnex.io` | `admin123` | [http://localhost:3000/admin](http://localhost:3000/admin) |
| **Supplier** | `supplier@pharmnex.io` | `supplier123` | [http://localhost:3000/supplier](http://localhost:3000/supplier) |
| **Manufacturer** | `manufacturer@pharmnex.io` | `manufacturer123` | [http://localhost:3000/manufacturer](http://localhost:3000/manufacturer) |
| **Wholesaler** | `wholesaler@pharmnex.io` | `wholesaler123` | [http://localhost:3000/wholesaler](http://localhost:3000/wholesaler) |
| **Distributor** | `distributor@pharmnex.io` | `distributor123` | [http://localhost:3000/distributor](http://localhost:3000/distributor) |
| **Customer** | `customer@pharmnex.io` | `customer123` | [http://localhost:3000/customer](http://localhost:3000/customer) |

### 🔍 Public Verification
You can also verify medicine batches without logging in via:
- [http://localhost:3000/verify](http://localhost:3000/verify)
- Sample Batch Code: `BATCH-2026-0921-A`
