# Project Blueprint — Blockchain-Enabled Pharmaceutical Supply Chain Security and Intelligence System using Machine Learning

## 1. One-Paragraph Summary

A pharmaceutical supply chain management system built on the **Algorand blockchain** (smart contracts) integrated with **three Python ML modules** — Fraud/Anomaly Detection, Counterfeit Medicine Risk Scoring, and Inventory Demand Forecasting. The research contribution: empirically testing whether blockchain-derived behavioural transaction features (transfer count, route deviation, timestamp irregularities, ownership hops) improve ML fraud-detection accuracy over conventional supply-chain features alone. Extends Abbas et al. (2020), which used ML only for drug recommendation, into active supply-chain security.

---

## 2. System Roles (6 participant types)

| Role | Core Actions |
|---|---|
| **Admin** | Register participants, deploy/assign smart contracts, view full supply chain + ML dashboard, investigate flagged transactions |
| **Supplier** | Manage raw materials, view/accept manufacturer orders, assign transporters |
| **Manufacturer** | Manage raw materials + medicines, create batches, record production on-chain, verify raw material orders |
| **Wholesaler** | Order from manufacturer, verify/update order status, view distributor orders |
| **Distributor** | Order from wholesaler, verify/update status, view customer orders |
| **Customer** | Register, search/order medicines, scan QR to verify authenticity, view supply chain history |

---

## 3. Architecture (Dual-Layer)

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Web Portal)                    │
│              HTML, CSS, JavaScript — role-based UI            │
└───────────────────────────┬───────────────────────────────────┘
                             │
┌───────────────────────────▼───────────────────────────────────┐
│                  BACKEND — ASP.NET (C#)                       │
│   Handles auth, role-based access control, business logic     │
└──────────────┬──────────────────────────┬─────────────────────┘
               │                          │
   ┌───────────▼───────────┐   ┌──────────▼──────────────────┐
   │  BLOCKCHAIN LAYER      │   │   ML INTELLIGENCE LAYER      │
   │  Algorand (TestNet)    │   │   Python 3.11 + FastAPI      │
   │  Smart Contracts:      │   │   (separate microservice)    │
   │  PyTeal / Algorand     │   │                              │
   │  Python, via           │◄──┤  Reads transaction data      │
   │  py-algorand-sdk       │   │  from MSSQL, runs 3 ML       │
   │                        │   │  modules, returns scores     │
   │  Records every         │   │  via REST API                │
   │  transaction           │   │                              │
   │  immutably              │   │  Module 1: Fraud/Anomaly    │
   └───────────┬─────────────┘   │  Module 2: Counterfeit Risk │
               │                 │  Module 3: Demand Forecast  │
   ┌───────────▼─────────────┐   └──────────────────────────────┘
   │   MSSQL DATABASE         │
   │   Persists all           │
   │   transactions +         │
   │   participant data       │
   │   (dual-stored with      │
   │   blockchain)            │
   └───────────────────────────┘
```

**Key design principle:** every transaction is written to BOTH the Algorand blockchain (immutable, tamper-evident) AND MSSQL (fast queryable store). The ML service reads from MSSQL; blockchain is the trust/verification layer.

---

## 4. Tech Stack (exact)

| Layer | Technology |
|---|---|
| Blockchain Platform | Algorand (TestNet → MainNet later) |
| Smart Contracts | PyTeal or Algorand Python, deployed via py-algorand-sdk |
| Backend | ASP.NET (C#) |
| Database | Microsoft SQL Server (MSSQL) |
| Frontend | HTML, CSS, JavaScript |
| ML Service | Python 3.11, FastAPI (REST API, separate microservice) |
| ML Libraries | scikit-learn (Isolation Forest, Random Forest, XGBoost), TensorFlow/Keras (LSTM) |
| Explainability | SHAP |
| Data Processing | pandas, NumPy |
| ML Dev Environment | Jupyter Notebook / Google Colab |
| IDE | Visual Studio (backend), VS Code (ML) |
| Base Dataset | Kaggle — "Blockchain-Based Medicine Supply Chain Management" (Bidyutmala Saha) + synthetic anomaly injection |

---

## 5. The Three ML Modules — Full Spec

### Module 1 — Fraud & Anomaly Detection (primary research contribution)

**Models:** Isolation Forest (unsupervised) + XGBoost (supervised, trained on synthetically injected anomalies)

**The Core Experiment (A/B test):**
- **Experiment A features (baseline):** `supplier_id, manufacturer_id, medicine_category, batch_size, manufacturing_location, distribution_duration_days, quantity_ordered, quantity_received, quantity_discrepancy`
- **Experiment B features (A + blockchain-behavioural):** all of A, plus `transfer_count, ownership_hops, route_deviation_score, timestamp_gap_hrs, verification_fail_count, unexpected_entity_flag`

**Hypothesis:** H1 = Experiment B outperforms Experiment A on F1-score and ROC-AUC. Test significance with McNemar's test (α = 0.05).

**Output:** real-time anomaly score (0–1) per transaction.

### Module 2 — Counterfeit Medicine Risk Scoring

**Model:** Random Forest classifier → Low / Medium / High risk label + probability

**Features:** `supplier_reliability_score, batch_size, manufacturing_location_risk_index, chain_verification_status, transfer_count, unexpected_transfer_flag, distribution_duration_deviation, complaint_history_count`

**Label source:** simulate known counterfeit-injection patterns (unregistered suppliers, abnormally short manufacturing times, route bypassing, multiple unexpected transfers) → derive ground-truth risk labels.

**Key differentiator:** scores risk from metadata alone — no physical sample needed (unlike every paper in your literature survey).

**Output:** risk label + SHAP explanation shown on admin dashboard.

### Module 3 — Inventory Demand Forecasting

**Models:** LSTM vs. XGBoost Regression (pick better by MAE/RMSE on held-out test set)

**Features:** `medicine_id, region, month, historical_demand (12-month rolling), seasonal_flag, complaint_rate, batch_expiry_proximity_days, previous_stockout_flag`

**Output:** 30-day demand forecast per medicine per region, displayed against current stock.

---

## 6. Database Schema (core tables)

```
Participants: participant_id, role, name, credentials, wallet_address, registered_date

RawMaterials: material_id, supplier_id, name, quantity, expiry_date

Medicines: medicine_id, manufacturer_id, name, category, batch_id, 
           manufacture_date, expiry_date, price

Batches: batch_id, medicine_id, batch_size, manufacturing_location, 
         production_date, current_custodian_id

Transactions: transaction_id, batch_id, sender_id, receiver_id, 
              transaction_type, timestamp, quantity, 
              blockchain_tx_hash, verification_status

Orders: order_id, buyer_id, seller_id, batch_id, quantity_ordered,
        quantity_received, status, order_date, delivery_date

ML_Scores: score_id, transaction_id, batch_id, anomaly_score,
           counterfeit_risk_label, counterfeit_risk_prob,
           demand_forecast, generated_at
```

---

## 7. Build Order (recommended sequence — 2 semesters)

### Phase 1 — Foundation (Weeks 1–4)
1. Set up Algorand TestNet account + sandbox environment
2. Write and deploy basic smart contracts (register participant, create batch, transfer custody)
3. Set up MSSQL schema
4. ASP.NET backend skeleton with role-based auth

### Phase 2 — Core Supply Chain Flow (Weeks 5–8)
5. Build all 6 role portals (frontend + backend CRUD)
6. Wire every transaction to write to both Algorand + MSSQL
7. QR code generation + scan-to-verify for customers
8. Basic transaction history viewer

### Phase 3 — Data & ML Foundation (Weeks 9–11)
9. Pull/clean Kaggle blockchain dataset; design final feature tables
10. Build synthetic anomaly injection script (10–15% anomaly rate, rule-based)
11. Exploratory data analysis + feature engineering notebook

### Phase 4 — ML Modules (Weeks 12–16)
12. Module 1: train Isolation Forest + XGBoost, run the A/B experiment, log metrics
13. Module 2: build Random Forest risk scorer + SHAP integration
14. Module 3: train + compare LSTM vs XGBoost Regression
15. Wrap all 3 models in a FastAPI microservice with REST endpoints

### Phase 5 — Integration (Weeks 17–19)
16. Connect ASP.NET backend to FastAPI ML service
17. Build admin intelligence dashboard (anomaly alerts, risk heatmap, forecast charts)
18. End-to-end testing across all roles

### Phase 6 — Evaluation & Paper (Weeks 20–24)
19. Run full A/B experiment, generate final metrics/plots
20. Write results section, prepare research paper draft
21. Final demo prep + documentation

---

## 8. What to Tell an AI Assistant to Start Coding

Paste this as your opening brief in a new coding session:

> "I'm building a Pharmaceutical Supply Chain Management System combining Algorand blockchain smart contracts with 3 ML modules (fraud detection, counterfeit risk scoring, demand forecasting). Stack: ASP.NET (C#) backend, MSSQL database, Algorand blockchain (PyTeal smart contracts via py-algorand-sdk), Python FastAPI microservice for ML (scikit-learn + TensorFlow), HTML/CSS/JS frontend. 6 roles: Admin, Supplier, Manufacturer, Wholesaler, Distributor, Customer. Let's start with [specific phase/component] — [paste relevant schema/spec from above]."

---

## 9. Research Framing to Keep Repeating (for professors + paper)

- **Baseline:** Abbas et al. (2020) — 471 citations — ML used only for drug recommendation
- **Core research question:** Do blockchain-derived behavioural features improve ML fraud detection accuracy over conventional features alone?
- **Novelty:** first system to (a) test that question empirically, (b) score counterfeit risk from metadata alone without a physical sample, (c) combine fraud detection + counterfeit scoring + demand forecasting in one blockchain-native ML layer
