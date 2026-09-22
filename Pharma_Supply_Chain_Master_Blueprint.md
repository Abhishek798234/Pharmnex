# Blockchain and ML-Based Pharmaceutical Supply Chain

## Blockchain and ML-Based Pharmaceutical Supply Chain

### Master Project Blueprint / Technical Specification

---

# 1. PROJECT IN ONE PARAGRAPH

The project is a web-based pharmaceutical supply-chain management system that combines **Blockchain and Machine Learning**.

The system tracks medicines from the **raw-material supplier → manufacturer → wholesaler → distributor → customer**.

Every important supply-chain event is recorded through **Algorand smart contracts**, creating a traceable, tamper-evident history.

On top of this blockchain-backed data, three Machine Learning modules are implemented:

1. **Fraud and Anomaly Detection**
2. **Counterfeit Medicine Risk Scoring**
3. **Inventory Demand Forecasting**

The main research idea is to determine whether **blockchain-derived behavioural features** such as ownership-transfer count, route deviation, timestamp gaps, verification failures, and unexpected entities can improve ML-based fraud detection compared with conventional supply-chain information alone. This is tested using an A/B experimental design.

---

# 2. THE SIMPLEST WAY TO EXPLAIN THE PROJECT

Imagine a medicine package travelling through many hands:

Supplier
↓
Manufacturer
↓
Wholesaler
↓
Distributor
↓
Customer

The problem is:

- Someone can introduce fake medicines.
- Someone can divert or steal a batch.
- A suspicious transaction may happen.
- Supply-chain records may be manipulated.
- Companies may not know how much medicine will be required in the future.

Our system solves this in two layers:

### Blockchain = TRUSTED MEMORY

Blockchain records:

> "What happened?"

### Machine Learning = INTELLIGENT ANALYSIS

ML asks:

> "Does what happened look suspicious?"

and:

> "Could this medicine batch be risky?"

and:

> "How much medicine will be needed in the future?"

Therefore:

**Blockchain gives trusted history + ML gives intelligence.**

---

# 3. PROJECT TITLE

### Project title

**Blockchain and ML-Based Pharmaceutical Supply Chain**

No separate product/brand name is fixed yet; the team can choose one later without changing the technical specification.

---

# 4. CORE PROBLEM

Pharmaceutical products pass through a complicated chain of organizations.

Every transfer creates an opportunity for:

- counterfeit medicine
- theft
- diversion
- suspicious transactions
- quantity manipulation
- route manipulation
- delayed detection
- poor inventory planning

Blockchain solves the **traceability problem**, but by itself it mainly tells us what happened.

Our project adds ML to make the system proactive.

The research gap identified in the synopsis is that existing blockchain-pharma systems are largely reactive, while previous blockchain + ML pharmaceutical work did not use blockchain transaction behaviour as ML features for active supply-chain security.

---

# 5. MAIN OBJECTIVES

The project should achieve these goals:

### Objective 1

Build a pharmaceutical supply-chain management system using **Algorand smart contracts**.

### Objective 2

Record important supply-chain transactions in a tamper-evident and traceable form.

### Objective 3

Develop a **Fraud and Anomaly Detection** module using:

- Isolation Forest
- XGBoost

### Objective 4

Develop a **Counterfeit Medicine Risk Scoring** module using:

- Random Forest

### Objective 5

Develop an **Inventory Demand Forecasting** module using:

- LSTM
- XGBoost Regression

### Objective 6

Test whether blockchain-derived behavioural features improve fraud detection.

### Objective 7

Create an **Admin Intelligence Dashboard** containing:

- anomaly alerts
- counterfeit risk
- supply-chain visualization
- demand forecasts
- blockchain transaction details

These objectives match the current synopsis and presentation.

---

# 6. COMPLETE SYSTEM ARCHITECTURE

The project should use a **dual-layer architecture**.

```
                         PHARMACEUTICAL SUPPLY CHAIN SYSTEM
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
     SUPPLY CHAIN LAYER            ML INTELLIGENCE LAYER
              │                           │
              │                           │
      ASP.NET + C#                    Python
              │                    Flask / FastAPI
              │                           │
              ▼                           ▼
        MSSQL Database              ML Models
              │                    ┌──────┼────────┐
              │                    │      │        │
              │                    ▼      ▼        ▼
              │                  Fraud  Counter- Demand
              │                  Detect- feit     Forecast
              │                  ion     Risk
              │
              ▼
        Algorand Blockchain
              │
              ▼
       Smart Contracts
       PyTeal / Algorand Python
              │
              ▼
       Immutable/Tamper-
       evident Transactions

```

The uploaded synopsis explicitly defines the architecture as a blockchain supply-chain layer plus an ML intelligence layer, connected using a Python REST API.

---

# 7. TECHNOLOGY STACK

## Frontend

Use:

- HTML
- CSS
- JavaScript

Optional:

- Bootstrap or a lightweight UI framework

The current synopsis specifies HTML, CSS and JavaScript.

---

## Backend

Use:

- ASP.NET
- C#

Responsibilities:

- authentication
- authorization
- role management
- business logic
- CRUD operations
- order management
- communication with MSSQL
- blockchain service integration
- communication with ML API

---

## Database

Use:

**Microsoft SQL Server / MSSQL**

Responsibilities:

- users
- medicines
- raw materials
- suppliers
- orders
- batches
- inventory
- transaction metadata
- ML outputs
- alerts
- audit information

Important:

The database stores application/query-friendly information.

Blockchain stores critical transaction/provenance records.

---

## Blockchain

Use:

**Algorand Blockchain**

Smart contracts:

- PyTeal / Algorand Python
- py-algorand-sdk

The uploaded synopsis explicitly specifies Algorand TestNet/MainNet, Algorand smart contracts, PyTeal/Algorand Python and the Python SDK.

---

## ML Service

Use:

- Python 3.11
- Flask or FastAPI
- pandas
- NumPy
- scikit-learn
- XGBoost
- TensorFlow / Keras
- SHAP

The ML service operates separately from the ASP.NET application and exposes REST endpoints.

---

## Development / Training Tools

Use:

- Visual Studio → ASP.NET/C#
- VS Code or PyCharm → Python service
- Jupyter Notebook / Google Colab → ML experiments
- Git/GitHub → source control

The synopsis specifically lists Visual Studio and Jupyter/Google Colab.

---

# 8. SIX USER ROLES

The system has six major roles.

```
ADMIN
  │
  ├── Supplier
  ├── Manufacturer
  ├── Wholesaler
  ├── Distributor
  └── Customer

```

The six roles are explicitly defined in the current architecture.

---

# 9. ADMIN MODULE

Admin is the central monitoring authority.

## Admin can:

### User management

- create/manage supplier accounts
- create/manage manufacturer accounts
- create/manage wholesaler accounts
- create/manage distributor accounts
- manage transporter information
- approve customers

### Blockchain management

- create/deploy smart contracts
- assign participant information
- view blockchain transactions
- inspect transaction IDs
- inspect block/provenance details
- verify transaction history

### ML monitoring

Admin dashboard should display:

- fraud/anomaly score
- counterfeit risk score
- high-risk batches
- high-risk suppliers
- risk heatmap
- demand forecasts
- current stock
- expected shortages

### Alert system

Example:

```
🚨 HIGH RISK ALERT

Batch: P101

Anomaly Score: 0.91
Counterfeit Risk: HIGH

Reasons:
- unexpected ownership transfer
- route deviation
- abnormal timestamp gap

Action:
Manual verification required

```

The synopsis workflow specifies automatic notification when anomaly score exceeds 0.80 or counterfeit risk is High.

---

# 10. SUPPLIER MODULE

Supplier handles raw materials.

## Main operations

- register/login
- manage raw-material inventory
- receive manufacturer orders
- approve/reject orders
- assign transporter
- update delivery status
- record dispatch
- maintain stock

Example:

```
Manufacturer requests:

Amoxicillin raw material
Quantity = 5,000 units

Supplier
↓
Accepts order
↓
Assigns transporter
↓
Dispatches material
↓
Blockchain records event

```

---

# 11. MANUFACTURER MODULE

Manufacturer converts raw materials into medicine.

## Main operations

- login
- view raw-material inventory
- order raw materials
- manage medicine information
- create medicine batches
- record batch details
- verify received raw materials
- update production status
- dispatch medicine to wholesaler

Example:

```
Raw Material
     ↓
Manufacturer
     ↓
Medicine Batch

Batch ID: PARA101
Medicine: Paracetamol
Quantity: 10,000
Manufacturing Date: ...
Expiry Date: ...

```

Batch creation becomes an important blockchain event.

---

# 12. WHOLESALER MODULE

Wholesaler purchases medicines from manufacturers.

## Main operations

- place medicine orders
- view manufacturer orders
- verify delivery
- update order status
- maintain inventory
- view distributor orders
- assign transporter

Typical flow:

```
Manufacturer
      ↓
Wholesaler
      ↓
Distributor

```

---

# 13. DISTRIBUTOR MODULE

Distributor is the next stage toward the customer.

## Main operations

- order medicines from wholesaler
- view orders
- verify received medicines
- update order status
- maintain inventory
- view customer orders
- assign transporter

---

# 14. CUSTOMER MODULE

Customer must register first.

## Customer can:

- register
- login
- search medicines
- view medicine details
- place an order
- view order status
- verify medicine
- scan QR code
- view medicine provenance/history

Example:

```
Customer scans QR
        ↓
Batch ID retrieved
        ↓
Blockchain provenance queried
        ↓
Customer sees:

Supplier
   ↓
Manufacturer
   ↓
Wholesaler
   ↓
Distributor
   ↓
Current owner

```

The current workflow explicitly includes QR-based provenance verification.

---

# 15. CORE SUPPLY-CHAIN FLOW

The complete normal flow is:

```
1. Admin
   ↓
2. Supplier registered
   ↓
3. Manufacturer registered
   ↓
4. Wholesaler registered
   ↓
5. Distributor registered
   ↓
6. Customer registered/approved
   ↓

RAW MATERIAL FLOW

Supplier
   ↓
Manufacturer
   ↓

MEDICINE PRODUCTION

Manufacturer creates batch
   ↓

DISTRIBUTION FLOW

Manufacturer
   ↓
Wholesaler
   ↓
Distributor
   ↓
Customer

```

Every significant event is simultaneously:

1. recorded through a smart-contract transaction on Algorand
2. persisted in MSSQL

The synopsis explicitly defines this dual storage model.

---

# 16. WHAT SHOULD GO ON BLOCKCHAIN?

Do NOT put the entire database on blockchain.

Use blockchain for:

- batch creation
- ownership/custody transfer
- order confirmation
- delivery confirmation
- verification status
- important timestamps
- participant identity references
- provenance records
- transaction hash / transaction ID

MSSQL handles:

- full user profiles
- UI data
- detailed order records
- inventory
- analytics
- ML outputs
- dashboard data

This keeps the system practical.

---

# 17. SMART CONTRACT RESPONSIBILITIES

The smart contract layer should define rules such as:

### Participant registration

Only authorized admin operations can register/approve participants.

### Order creation

A valid participant creates an order.

### Order acceptance

Authorized receiver accepts the order.

### Custody transfer

Ownership/custody moves from one authorized participant to another.

### Batch creation

Manufacturer creates a batch using valid raw materials.

### Delivery confirmation

Receiver confirms delivery.

### Verification

The system can verify whether the medicine's expected provenance exists.

---

# 18. EXAMPLE SMART-CONTRACT LOGIC

Conceptually:

```
IF Manufacturer creates Batch
THEN
    validate manufacturer
    assign Batch ID
    record batch creation
    store timestamp
    emit transaction

```

Another:

```
IF Manufacturer transfers Batch to Wholesaler
THEN
    verify current owner == Manufacturer
    verify recipient is authorized
    update current owner
    record transfer
    emit transaction

```

This prevents an arbitrary participant from simply claiming ownership.

---

# 19. HASHING / SHA

Use SHA hashing for integrity-related records where required by the design.

Think of a hash as a **digital fingerprint**.

Example:

```
Transaction Data
      ↓
SHA Hash
      ↓
A83F92...

```

If the data changes:

```
Changed Transaction Data
      ↓
Different Hash

```

Therefore, the system can detect inconsistency/tampering.

The project documents mention SHA as part of the technology stack.

---

# 20. ML ARCHITECTURE

The ML service should NOT directly control the blockchain.

Instead:

```
ASP.NET
   ↓
MSSQL
   ↓
Python ML API
   ↓
ML model
   ↓
prediction
   ↓
MSSQL
   ↓
ASP.NET Dashboard

```

Blockchain and ML remain logically separated.

---

# 21. MODULE 1 — FRAUD & ANOMALY DETECTION

This is the **primary research module**.

The objective:

> Detect supply-chain transactions that behave differently from normal transactions.

---

## Model A: Isolation Forest

Type:

**Unsupervised anomaly detection**

It learns what normal transactions look like.

Then a new transaction is checked.

Example:

```
Normal:

Transfer count = 2
Time gap = 48 hours
Route = expected

→ NORMAL

```

Suspicious:

```
Transfer count = 8
Time gap = 1 hour
Route = unexpected

→ ANOMALY

```

Isolation Forest gives an anomaly score.

---

## Model B: XGBoost

XGBoost is the supervised model.

Because true fraud labels are difficult to obtain, the project uses **synthetic anomaly injection** into legitimate data.

Examples of injected anomalies:

- unexpected ownership transfer
- route deviation
- unusually short transfer interval
- quantity discrepancy

These patterns are explicitly described in the synopsis.

---

# 22. FRAUD DETECTION FEATURES

## Traditional features

Experiment A:

```
supplier_id
manufacturer_id
medicine_category
batch_size
manufacturing_location
distribution_duration_days
quantity_ordered
quantity_received
quantity_discrepancy

```

## Blockchain-derived features

Experiment B adds:

```
transfer_count
ownership_hops
route_deviation_score
timestamp_gap_hrs
verification_fail_count
unexpected_entity_flag

```

The synopsis defines these two feature groups for the A/B experiment.

---

# 23. WHY THE BLOCKCHAIN FEATURES MATTER

Suppose two batches have exactly the same:

```
medicine
batch size
supplier
location
quantity

```

Traditional ML might treat them similarly.

But blockchain behaviour reveals:

Batch A:

```
2 transfers
expected route
48-hour intervals
verified

```

Batch B:

```
7 transfers
unexpected entity
route deviation
15-minute intervals
verification failure

```

Therefore the second batch should receive a much higher anomaly score.

This is the core research idea.

---

# 24. A/B RESEARCH EXPERIMENT

This is one of the most important parts of the project.

### Experiment A

Use only conventional supply-chain features.

```
Traditional Features
        ↓
ML
        ↓
Fraud Detection

```

### Experiment B

Use:

```
Traditional Features
        +
Blockchain Behavioural Features
        ↓
ML
        ↓
Fraud Detection

```

Then compare the results.

---

# 25. RESEARCH HYPOTHESIS

### H1

Blockchain-derived behavioural features improve ML fraud/anomaly detection performance.

### H0

There is no statistically significant improvement.

The uploaded synopsis explicitly frames this hypothesis and A/B comparison.

---

# 26. FRAUD DETECTION METRICS

Use:

- Precision
- Recall
- F1-score
- ROC-AUC
- Average Precision

For the proposed statistical comparison, the synopsis specifies **McNemar's test with alpha = 0.05**.

Do not decide the final performance numbers before experiments are actually run.

---

# 27. MODULE 2 — COUNTERFEIT MEDICINE RISK SCORING

This module does NOT claim to physically prove that a medicine is fake.

It calculates:

> **How risky does this medicine batch look based on supply-chain metadata?**

This distinction is important.

---

# 28. COUNTERFEIT RISK OUTPUT

Example:

```
Batch ID: MED1021

Risk Probability: 82%

Risk Level:
HIGH

```

Categories from the current design:

```
0–35%   = LOW
36–70%  = MEDIUM
71–100% = HIGH

```

The thresholds are specified in the synopsis.

---

# 29. COUNTERFEIT MODEL

Use:

**Random Forest Classifier**

Output:

```
Probability
      ↓
Low / Medium / High

```

---

# 30. COUNTERFEIT FEATURES

Use:

```
supplier_reliability_score
batch_size
manufacturing_location_risk_index
chain_verification_status
transfer_count
unexpected_transfer_flag
distribution_duration_deviation
complaint_history_count

```

These are the features specified in the current methodology.

---

# 31. HOW DO WE CREATE THE COUNTERFEIT LABEL?

This is one of the trickiest parts of the entire project.

Real labelled counterfeit pharmaceutical datasets are difficult to obtain.

Therefore the current methodology proposes **simulated supply-chain scenarios** to derive risk labels.

Examples:

### Low risk

```
registered supplier
normal route
normal manufacturing duration
normal number of transfers
fully verified chain

```

### Medium risk

```
some abnormal behaviour
minor route deviation
some verification issues

```

### High risk

```
unregistered supplier
route bypass
multiple unexpected ownership transfers
abnormally short manufacturing time

```

The synopsis explicitly proposes deriving risk labels from simulated supply-chain scenarios.

Important:

In the final paper, clearly state that these are **simulated risk labels**, not laboratory-confirmed counterfeit medicines.

---

# 32. SHAP EXPLAINABILITY

Don't just show:

```
Counterfeit Risk = 87%

```

Show why.

Example:

```
Counterfeit Risk = 87%

Top contributing factors:

Unexpected transfers        +0.27
Low supplier reliability    +0.22
Route deviation             +0.18
Verification failures       +0.11
Large quantity discrepancy  +0.07

```

SHAP is used to make the prediction interpretable.

---

# 33. MODULE 3 — INVENTORY DEMAND FORECASTING

This module answers:

> **How much medicine will probably be needed in the future?**

Example:

```
Medicine: Paracetamol
Region: Delhi NCR

Current stock = 8,000

Predicted next 30 days = 12,500

→ Possible shortage
→ Restocking recommended

```

---

# 34. FORECASTING MODELS

Compare:

### LSTM

Good for sequential/time-series patterns.

### XGBoost Regression

Good for structured features and feature-based forecasting.

The model with better held-out MAE and RMSE is selected for deployment.

---

# 35. DEMAND FEATURES

Current methodology includes:

```
medicine_id
region
month
historical_demand
seasonal_flag
complaint_rate
batch_expiry_proximity_days
previous_stockout_flag

```

Historical demand is calculated using a 12-month rolling window from blockchain-verified orders.

---

# 36. FORECAST OUTPUT

Dashboard should show:

```
Medicine       Current Stock   Forecast 30 Days   Status

Paracetamol       8,000            12,500         ⚠️ LOW
Amoxicillin       9,000             6,800         ✅ OK
Ibuprofen         3,000             5,500         ⚠️ LOW

```

This helps with proactive inventory planning.

---

# 37. COMPLETE DATA FLOW

```
USER ACTION
    ↓
ASP.NET APPLICATION
    ↓
BUSINESS VALIDATION
    ↓
SMART CONTRACT
    ↓
ALGORAND BLOCKCHAIN
    ↓
TRANSACTION CONFIRMATION
    ↓
MSSQL
    ↓
ML DATA PIPELINE
    ↓
FEATURE ENGINEERING
    ↓
ML MODEL
    ↓
PREDICTION
    ↓
ML REST API
    ↓
ASP.NET
    ↓
ADMIN DASHBOARD

```

---

# 38. DATABASE DESIGN

Recommended core tables:

### Users

```
Users
-----
UserId
Name
Email
PasswordHash
Role
OrganizationId
BlockchainAddress
Status
CreatedAt

```

### Organizations

```
Organizations
-------------
OrganizationId
Name
Type
Address
RegistrationNumber
ReliabilityScore
Status

```

### Medicines

```
Medicines
---------
MedicineId
Name
Category
Description
UnitPrice
ExpiryPeriod

```

### RawMaterials

```
RawMaterials
------------
RawMaterialId
Name
SupplierId
QuantityAvailable
Unit
Status

```

### MedicineBatches

```
MedicineBatches
---------------
BatchId
MedicineId
ManufacturerId
Quantity
ManufacturingDate
ExpiryDate
ManufacturingLocation
Status
BlockchainTxId

```

### Orders

```
Orders
------
OrderId
BuyerId
SellerId
MedicineId
BatchId
Quantity
OrderDate
Status

```

### CustodyTransfers

```
CustodyTransfers
----------------
TransferId
BatchId
FromEntity
ToEntity
Timestamp
Location
Quantity
BlockchainTxId
VerificationStatus

```

### BlockchainTransactions

```
BlockchainTransactions
----------------------
TransactionId
TxHash
BatchId
EventType
Sender
Receiver
Timestamp
BlockReference
Status

```

### MLAnomalyScores

```
MLAnomalyScores
---------------
PredictionId
TransactionId
IsolationForestScore
XGBoostProbability
FinalAnomalyScore
RiskLevel
CreatedAt

```

### CounterfeitRisk

```
CounterfeitRisk
---------------
RiskId
BatchId
Probability
RiskLevel
TopFactors
ModelVersion
CreatedAt

```

### DemandForecasts

```
DemandForecasts
---------------
ForecastId
MedicineId
Region
ForecastDate
PredictedDemand
CurrentStock
ModelUsed
MAE
RMSE
CreatedAt

```

### Alerts

```
Alerts
------
AlertId
Type
BatchId
TransactionId
Severity
Message
Status
CreatedAt

```

---

# 39. IMPORTANT DATABASE PRINCIPLE

Do not store the ML model itself in SQL.

Store:

- prediction
- score
- model version
- timestamp
- explanation
- reference ID

Store actual model files separately:

```
models/
    fraud_isolation_forest.pkl
    fraud_xgboost.pkl
    counterfeit_rf.pkl
    demand_lstm.keras
    demand_xgb.pkl

```

---

# 40. REST API DESIGN

The Python ML service can expose endpoints such as:

### Fraud

```
POST /api/ml/fraud/predict

```

Input:

```
{
  "supplier_id": "SUP01",
  "batch_size": 5000,
  "transfer_count": 6,
  "ownership_hops": 4,
  "route_deviation_score": 0.8,
  "timestamp_gap_hrs": 1.2,
  "verification_fail_count": 2,
  "unexpected_entity_flag": 1
}

```

Output:

```
{
  "anomaly_score": 0.91,
  "risk_level": "HIGH",
  "model": "isolation_forest"
}

```

---

### Counterfeit

```
POST /api/ml/counterfeit/predict

```

Output:

```
{
  "risk_probability": 0.82,
  "risk_level": "HIGH",
  "top_factors": [
    "unexpected_transfer",
    "low_supplier_reliability",
    "route_deviation"
  ]
}

```

---

### Demand Forecast

```
POST /api/ml/demand/forecast

```

Output:

```
{
  "medicine": "Paracetamol",
  "region": "Delhi",
  "forecast_30_days": 12500,
  "current_stock": 8000,
  "model": "XGBoost"
}

```

---

# 41. RECOMMENDED ML PROJECT STRUCTURE

```
ml-service/
│
├── app.py
├── requirements.txt
│
├── models/
│   ├── fraud/
│   │   ├── isolation_forest.pkl
│   │   └── xgboost.pkl
│   │
│   ├── counterfeit/
│   │   └── random_forest.pkl
│   │
│   └── demand/
│       ├── lstm.keras
│       └── xgboost.pkl
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── synthetic/
│
├── notebooks/
│   ├── fraud_experiment.ipynb
│   ├── counterfeit_risk.ipynb
│   └── demand_forecasting.ipynb
│
├── src/
│   ├── preprocessing/
│   ├── feature_engineering/
│   ├── fraud/
│   ├── counterfeit/
│   ├── demand/
│   └── evaluation/
│
└── utils/

```

---

# 42. ASP.NET PROJECT STRUCTURE

Recommended structure:

```
pharma-supply-chain/
│
├── Controllers/
│   ├── AuthController.cs
│   ├── AdminController.cs
│   ├── SupplierController.cs
│   ├── ManufacturerController.cs
│   ├── WholesalerController.cs
│   ├── DistributorController.cs
│   ├── CustomerController.cs
│   ├── OrderController.cs
│   ├── BlockchainController.cs
│   └── MLController.cs
│
├── Models/
│
├── ViewModels/
│
├── Services/
│   ├── BlockchainService.cs
│   ├── MLService.cs
│   ├── OrderService.cs
│   └── NotificationService.cs
│
├── Data/
│   └── ApplicationDbContext.cs
│
├── Views/
│   ├── Admin/
│   ├── Supplier/
│   ├── Manufacturer/
│   ├── Wholesaler/
│   ├── Distributor/
│   └── Customer/
│
└── wwwroot/
    ├── css/
    ├── js/
    └── images/

```

---

# 43. SMART CONTRACT PROJECT STRUCTURE

```
blockchain/
│
├── contracts/
│   ├── participant_contract.py
│   ├── batch_contract.py
│   ├── order_contract.py
│   ├── custody_contract.py
│   └── verification_contract.py
│
├── deployment/
│   ├── deploy.py
│   └── config.py
│
└── scripts/
    ├── create_accounts.py
    └── test_transactions.py

```

The exact number of contracts can be reduced if one application-level smart contract is easier for the team to manage.

For a B.Tech project, prioritize **correctness and demonstrability over unnecessary smart-contract complexity**.

---

# 44. QR CODE VERIFICATION FLOW

This is an excellent demo feature.

During batch creation:

```
Batch ID
   ↓
Generate QR
   ↓
Associate QR with batch

```

Customer scans:

```
QR Code
   ↓
Batch ID
   ↓
Backend
   ↓
Blockchain provenance
   ↓
Supply-chain history

```

Display:

```
✅ Batch Verified

Medicine: Paracetamol
Batch: P101

Manufacturer: ABC Pharma
Current Distributor: XYZ
Transfers: 3
Blockchain Status: Verified
Counterfeit Risk: LOW

```

The uploaded workflow explicitly includes customer QR-code provenance verification.

---

# 45. ADMIN INTELLIGENCE DASHBOARD

The dashboard is the main "wow" screen.

Recommended sections:

## Top cards

```
Total Batches
Total Orders
Active Participants
High-Risk Transactions
High-Risk Batches
Current Stock Alerts

```

## Supply-chain map

Show:

```
Supplier
  ↓
Manufacturer
  ↓
Wholesaler
  ↓
Distributor
  ↓
Customer

```

## Fraud section

Show:

- anomaly score
- suspicious transactions
- anomaly trends
- high-risk suppliers

## Counterfeit section

Show:

- risk by batch
- risk by supplier
- low/medium/high distribution

## Forecast section

Show:

- current inventory
- predicted demand
- expected shortage
- expected surplus

The current presentation specifically calls for anomaly alerts, risk heatmaps and demand forecasts.

---

# 46. SECURITY

The application should include:

### Authentication

- hashed passwords
- session/JWT-based authentication

### Authorization

Role-based access:

```
Admin       → everything
Supplier    → supplier operations
Manufacturer→ manufacturing operations
Wholesaler  → wholesale operations
Distributor → distribution operations
Customer    → own orders/provenance

```

### Database security

- parameterized queries / ORM
- no plaintext passwords
- validation
- access control

### Blockchain security

- only authorized accounts execute permitted transactions
- verify sender/current owner
- store transaction IDs
- verify provenance

---

# 47. IMPORTANT SECURITY PRINCIPLE

Blockchain does NOT magically make bad input true.

For example:

```
Manufacturer uploads:
"Quantity = 10,000"

```

Blockchain can make the recorded transaction tamper-evident.

But if the manufacturer is dishonest and enters:

```
"Quantity = 10,000"

```

when the actual quantity is 7,000, blockchain alone cannot know the physical quantity is wrong.

Therefore the project architecture should explain:

> Blockchain protects the integrity and traceability of recorded events, while ML detects suspicious behavioural patterns and risk indicators.

This is an important limitation to state honestly in the viva.

---

# 48. WHAT HAPPENS IF THE MANUFACTURER IS CORRUPT?

This should be prepared as a viva answer.

Suppose the manufacturer creates a fake batch.

Blockchain records:

```
Manufacturer → Batch created

```

But ML can look at:

- supplier history
- unusual manufacturing timing
- route behaviour
- unexpected transfers
- verification failures
- quantity patterns
- previous suspicious activity

and generate:

```
Counterfeit Risk = HIGH

```

or

```
Anomaly Score = HIGH

```

The system then alerts the admin.

However, the correct scientific claim is:

> The system does not physically prove that a medicine is counterfeit. It proactively assigns a risk score based on supply-chain metadata and behavioural signals.

---

# 49. DATASET

Current project documentation specifies:

**Kaggle: Blockchain-Based Medicine Supply Chain Management**

plus **synthetic anomaly injection**.

The data pipeline should be:

```
Original Dataset
      ↓
Data Cleaning
      ↓
Exploratory Analysis
      ↓
Feature Engineering
      ↓
Blockchain Behaviour Features
      ↓
Synthetic Anomaly Injection
      ↓
Training Dataset
      ↓
Train/Test Split
      ↓
Model Training
      ↓
Evaluation

```

---

# 50. DATASET WARNING

Do not say:

> "We trained on real fraud labels."

unless you genuinely have real verified fraud labels.

For Module 1, the current methodology uses **synthetic anomalous transaction injection**.

For Module 2, risk labels are derived from **simulated supply-chain scenarios**.

These assumptions should be documented clearly in the research paper.

---

# 51. SYNTHETIC FRAUD SCENARIOS

Create controlled anomaly rules.

Example:

### Scenario 1 — Route deviation

Normal:

```
Manufacturer → Wholesaler → Distributor

```

Synthetic anomaly:

```
Manufacturer → Unknown → Distributor

```

### Scenario 2 — Transfer burst

Normal:

```
2 transfers in 48 hours

```

Synthetic:

```
8 transfers in 1 hour

```

### Scenario 3 — Quantity discrepancy

Normal:

```
Ordered = 1000
Received = 1000

```

Anomaly:

```
Ordered = 1000
Received = 1400

```

### Scenario 4 — Unknown participant

```
unexpected_entity_flag = 1

```

The current methodology specifically names unexpected transfers, route deviation, unusually short transfer intervals and quantity discrepancies as anomaly patterns.

---

# 52. MODEL TRAINING PROCESS

## Fraud

```
Clean data
   ↓
Feature engineering
   ↓
Normal behaviour
   ↓
Isolation Forest

```

Separately:

```
Clean data
   ↓
Inject synthetic anomalies
   ↓
Labels
   ↓
XGBoost

```

Then compare A/B feature sets.

---

## Counterfeit

```
Supply-chain metadata
   ↓
Simulated risk scenarios
   ↓
Risk labels
   ↓
Random Forest
   ↓
Probability
   ↓
Low / Medium / High

```

---

## Demand

```
Historical verified orders
   ↓
Time-series preprocessing
   ↓
Feature engineering
   ↓
LSTM
          \
           → compare → best model
          /
XGBoost

```

---

# 53. TRAIN / VALIDATION / TEST

Fraud and counterfeit:

Use a proper train/test separation.

Avoid data leakage.

Demand forecasting:

Do **not** randomly shuffle time-series data.

Use chronological splitting:

```
Past data       → Training
Recent data     → Validation
Latest data     → Test

```

This is important for a credible research result.

---

# 54. EXPECTED OUTPUTS

### Fraud

```
Anomaly score
Risk level
Reason/features

```

### Counterfeit

```
Risk probability
Low/Medium/High
SHAP explanation

```

### Demand

```
Predicted demand
Current stock
Shortage/surplus indicator

```

The presentation currently defines these modules and the expected evaluation approach.

---

# 55. FINAL USER JOURNEY

## Example: customer buying Paracetamol

```
Customer logs in
       ↓
Searches Paracetamol
       ↓
Chooses Batch P101
       ↓
Places order
       ↓
Distributor confirms
       ↓
Blockchain stores transfer
       ↓
Customer receives medicine
       ↓
Scans QR
       ↓
System retrieves provenance
       ↓
Customer sees:

Supplier
↓
Manufacturer
↓
Wholesaler
↓
Distributor
↓
Current batch

Blockchain: VERIFIED
Risk: LOW

```

---

# 56. FINAL ADMIN JOURNEY

```
Admin logs in
      ↓
Dashboard
      ↓
Sees all transactions
      ↓
ML analyzes activity
      ↓
Suspicious transaction found
      ↓
Anomaly Score = 0.91
      ↓
Counterfeit Risk = HIGH
      ↓
Admin receives alert
      ↓
Admin opens batch
      ↓
Views:
- supply-chain route
- blockchain transactions
- risk explanation
- SHAP factors
      ↓
Admin investigates

```

---

# 57. FULL ARCHITECTURE WITH ALL COMPONENTS

```
                         ┌───────────────────────┐
                         │       USERS           │
                         │                       │
                         │ Admin                 │
                         │ Supplier              │
                         │ Manufacturer          │
                         │ Wholesaler            │
                         │ Distributor           │
                         │ Customer              │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │      FRONTEND         │
                         │     HTML/CSS/JS       │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │    ASP.NET + C#       │
                         │      BACKEND          │
                         └───────┬────────┬──────┘
                                 │        │
                    ┌────────────┘        └─────────────┐
                    ▼                                   ▼
          ┌─────────────────┐                  ┌─────────────────┐
          │   MSSQL         │                  │ ML REST API     │
          │                 │                  │ Flask/FastAPI   │
          └────────┬────────┘                  └────────┬────────┘
                   │                                    │
                   │                             ┌──────┼──────┐
                   │                             │      │      │
                   │                             ▼      ▼      ▼
                   │                           Fraud Counter Demand
                   │                           ML    feit  Forecast
                   │                                 Risk
                   │
                   ▼
          ┌───────────────────┐
          │   ALGorand        │
          │   BLOCKCHAIN      │
          │                   │
          │ Smart Contracts   │
          │ PyTeal            │
          │ Algorand Python   │
          └─────────┬─────────┘
                    │
                    ▼
          Provenance / Transaction
          / Custody / Verification

```

---

# 58. RECOMMENDED API COMMUNICATION

### ASP.NET → ML

Send JSON.

```
ASP.NET
   ↓
POST /api/ml/fraud/predict
   ↓
Python
   ↓
Model

```

Python responds with JSON.

```
Python
   ↓
JSON prediction
   ↓
ASP.NET
   ↓
Dashboard

```

This clean separation makes development much easier.

---

# 59. WHAT THE ML SERVICE SHOULD NEVER DO

The ML API should not:

- directly edit blockchain transactions
- directly change ownership
- approve medicines
- act as a replacement for the admin
- permanently alter business records

ML should provide:

> **decision support**

The business layer makes the final operational decision.

---

# 60. RECOMMENDED DEVELOPMENT ORDER

Do NOT try to build everything simultaneously.

Build in this order:

### Phase 1 — Base application

- project setup
- database
- authentication
- roles
- basic UI

### Phase 2 — Supply-chain workflow

- supplier
- manufacturer
- wholesaler
- distributor
- customer
- orders
- medicine batches
- inventory

### Phase 3 — Blockchain

- Algorand accounts
- smart contracts
- batch creation
- transfer
- verification
- transaction storage

### Phase 4 — Dataset pipeline

- dataset cleaning
- feature engineering
- synthetic anomalies
- labels

### Phase 5 — Fraud ML

- Isolation Forest
- XGBoost
- A/B experiment

### Phase 6 — Counterfeit ML

- Random Forest
- risk scoring
- SHAP

### Phase 7 — Demand ML

- LSTM
- XGBoost Regression
- model comparison

### Phase 8 — ML API

- FastAPI/Flask
- endpoints
- model loading
- prediction services

### Phase 9 — Dashboard

- anomaly alerts
- risk heatmap
- forecasts
- provenance

### Phase 10 — Integration & testing

- end-to-end workflow
- security
- performance
- demo scenarios

---

# 61. TEAM DIVISION

For four members, a practical division is:

## Member 1 — Blockchain

Responsible for:

- Algorand setup
- wallets/accounts
- smart contracts
- transaction creation
- provenance
- blockchain verification

---

## Member 2 — Backend + Database

Responsible for:

- ASP.NET/C#
- authentication
- MSSQL
- APIs
- CRUD
- business logic
- role permissions

---

## Member 3 — ML Research

Responsible for:

- dataset
- preprocessing
- fraud detection
- synthetic anomaly generation
- A/B experiment
- evaluation

---

## Member 4 — ML + Frontend / Dashboard

Responsible for:

- counterfeit risk
- demand forecasting
- SHAP
- frontend
- admin dashboard
- visualization
- QR verification

---

# 62. EVERYONE SHOULD KNOW THE CORE FLOW

Even if one person owns a module, all members should understand:

```
User
 ↓
ASP.NET
 ↓
MSSQL
 ↓
Blockchain
 ↓
ML
 ↓
Dashboard

```

Otherwise the team will struggle during viva.

---

# 63. WHAT TO SHOW IN THE FINAL DEMO

Do not make the demo just:

> "Here is our login page."

Make it a story.

### Demo Scenario

Create:

**Medicine:** Paracetamol

**Batch:** P101

Then show:

```
Supplier
 ↓
Manufacturer
 ↓
Wholesaler
 ↓
Distributor

```

Then deliberately create a suspicious route:

```
Manufacturer
 ↓
Wholesaler
 ↓
Unknown Entity
 ↓
Distributor

```

ML should detect:

```
Anomaly = HIGH

```

Then show:

```
Counterfeit Risk = HIGH

```

Then show:

```
Admin Alert

```

Then scan the QR code.

Show:

```
Blockchain Provenance

```

Then switch to demand forecasting:

```
Current Stock = 5,000
Predicted Demand = 8,500

⚠️ Restock Recommended

```

That single demo tells the whole story.

---

# 64. RESEARCH CONTRIBUTION

The strongest research contribution is **not simply "we used blockchain and ML."**

The primary contribution is:

> Test whether adding blockchain-derived behavioural features improves pharmaceutical supply-chain fraud detection.

Specifically:

```
Experiment A
Traditional features
        ↓
ML

versus

Experiment B
Traditional features
+
Blockchain behavioural features
        ↓
ML

```

Then compare performance.

This is the central research hypothesis in the uploaded synopsis.

---

# 65. FOUR PROJECT CONTRIBUTIONS

### Contribution 1

Blockchain behavioural features for fraud detection.

### Contribution 2

Metadata-based counterfeit risk scoring.

### Contribution 3

Controlled A/B experiment measuring the effect of blockchain-derived features.

### Contribution 4

Demand forecasting using blockchain-verified transaction history.

These are the four contributions stated in the current conclusion.

---

# 66. FUTURE SCOPE

Possible future extensions:

### IoT

Temperature/humidity monitoring for cold-chain medicines.

### Federated Learning

Allow organizations to collaboratively train models without sharing raw proprietary datasets.

### NLP

Analyze pharmaceutical regulatory/inspection reports.

These are already listed in the project synopsis.

---

# 67. LIMITATIONS TO ACKNOWLEDGE

A strong project does not hide limitations.

### Limitation 1

Synthetic anomalies are not the same as real-world confirmed fraud.

### Limitation 2

Counterfeit risk scoring does not physically authenticate medicine.

### Limitation 3

Blockchain cannot guarantee that users entered truthful information.

### Limitation 4

Model quality depends heavily on dataset quality.

### Limitation 5

Demand forecasts depend on the quality and quantity of historical order data.

These limitations actually make the research more credible.

---

# 68. WHAT NOT TO CLAIM

Avoid saying:

❌ "Our ML proves a medicine is counterfeit."

Say:

✅ "Our ML estimates counterfeit risk."

Avoid:

❌ "Blockchain prevents all fraud."

Say:

✅ "Blockchain provides tamper-evident traceability and strengthens transaction integrity."

Avoid:

❌ "The model will definitely detect every fraud."

Say:

✅ "The model identifies suspicious patterns based on learned behavioural signals."

---

# 69. IMPORTANT PROJECT DECISION: ALGORAND VS STRATIS

There is a mismatch between earlier project discussions and the current uploaded documents.

### Earlier discussion

Stratis was mentioned.

### Current uploaded synopsis/PPT

Algorand is specified throughout the architecture, smart-contract layer, workflow and technology stack.

Therefore:

## CURRENT OFFICIAL BASELINE

**Algorand + PyTeal/Algorand Python + py-algorand-sdk**

Do not mix Stratis into the implementation unless your team officially decides to change the architecture.

If the blockchain platform is changed later, the smart-contract integration layer will need to be redesigned.

---

# 70. MINIMUM VIABLE VERSION

If time becomes short, prioritize:

### MUST HAVE

- login/register
- six roles
- medicine batches
- orders
- custody transfers
- Algorand transaction recording
- provenance verification
- Fraud ML
- Counterfeit Risk ML
- Demand Forecasting
- Admin dashboard
- QR verification

### NICE TO HAVE

- advanced maps
- notifications
- transporter tracking
- elaborate animations
- advanced analytics
- IoT
- federated learning

Do not sacrifice the research modules for decorative UI.

---

# 71. FINAL TECHNICAL STACK — ONE TABLE

| LayerTechnology |                                                    |
| --------------- | -------------------------------------------------- |
| Frontend        | HTML, CSS, JavaScript                              |
| Backend         | ASP.NET + C#                                       |
| Database        | Microsoft SQL Server                               |
| Blockchain      | Algorand                                           |
| Smart Contracts | PyTeal / Algorand Python                           |
| Blockchain SDK  | py-algorand-sdk                                    |
| Hashing         | SHA                                                |
| ML API          | Python + Flask/FastAPI                             |
| Data Processing | pandas, NumPy                                      |
| Fraud ML        | Isolation Forest + XGBoost                         |
| Counterfeit ML  | Random Forest                                      |
| Demand ML       | LSTM + XGBoost Regression                          |
| Explainability  | SHAP                                               |
| ML Libraries    | scikit-learn, TensorFlow/Keras                     |
| ML Environment  | Jupyter / Google Colab                             |
| Main IDE        | Visual Studio                                      |
| Dataset         | Kaggle Medicine Supply Chain + synthetic anomalies |

This stack is directly aligned with the current synopsis.

---

# 72. ONE-SENTENCE PROJECT DESCRIPTION

Use this whenever someone asks:

> **This project is a blockchain-backed pharmaceutical supply-chain system that records medicine provenance on Algorand and uses machine learning to detect anomalous transactions, score counterfeit risk, and forecast medicine demand.**

---

# 73. TWO-MINUTE EXPLANATION FOR A PROFESSOR

> Pharmaceutical medicines pass through multiple stages such as supplier, manufacturer, wholesaler and distributor before reaching the customer. During this process, fraud, diversion, counterfeit insertion and supply shortages can occur.
>
> Our project uses Algorand blockchain to record important supply-chain events such as batch creation, order confirmation, custody transfer and delivery confirmation, creating a traceable and tamper-evident history.
>
> On top of this blockchain-backed data, we have three machine-learning modules. The first is Fraud and Anomaly Detection using Isolation Forest and XGBoost. It uses both conventional supply-chain features and blockchain-derived behavioural features such as transfer count, ownership hops, route deviation and timestamp gaps.
>
> The second module is Counterfeit Medicine Risk Scoring using Random Forest. Instead of physically inspecting a medicine sample, it estimates the risk of a batch using supply-chain metadata such as supplier reliability, transfer history and verification status.
>
> The third module is Inventory Demand Forecasting using LSTM and XGBoost Regression, which predicts future demand using blockchain-verified historical orders.
>
> The main research contribution is a controlled A/B experiment comparing fraud detection using traditional features alone against traditional features combined with blockchain-derived behavioural features. We evaluate this using precision, recall, F1-score, ROC-AUC and related metrics.
>
> The final system provides an administrator dashboard with alerts, risk scores, blockchain provenance and demand forecasts.

---

# 74. ONE MASTER PROMPT TO GIVE AN AI

Use the following whenever you ask another AI to help build this project:

> **You are helping develop a final-year B.Tech project called Blockchain and ML-Based Pharmaceutical Supply Chain.**
>
> The system is a pharmaceutical supply-chain management platform with six roles: Admin, Supplier, Manufacturer, Wholesaler, Distributor and Customer.
>
> The platform manages raw materials, medicines, medicine batches, orders, inventory, custody transfers, deliveries and customer verification.
>
> The system uses **Algorand Blockchain**, with smart contracts implemented using **PyTeal/Algorand Python** and the **py-algorand-sdk**.
>
> The main business backend is **ASP.NET with C#**, and the database is **Microsoft SQL Server (MSSQL)**.
>
> The frontend uses **HTML, CSS and JavaScript**.
>
> A separate **Python Flask/FastAPI REST API** provides Machine Learning services.
>
> There are three ML modules:
>
> **Module 1 — Fraud and Anomaly Detection**
>
> - Isolation Forest for unsupervised anomaly detection
> - XGBoost for supervised classification using synthetically injected anomalies
> - Features include supplier/manufacturer information, batch size, manufacturing location, distribution duration, quantities, transfer count, ownership hops, route deviation score, timestamp gaps, verification failure count and unexpected entity flag.
> - The research experiment compares:
>   - Experiment A: traditional supply-chain features
>   - Experiment B: traditional + blockchain-derived behavioural features
> - Compare using precision, recall, F1-score, ROC-AUC and Average Precision.
>
> **Module 2 — Counterfeit Medicine Risk Scoring**
>
> - Random Forest classifier
> - Outputs counterfeit risk probability and Low/Medium/High risk
> - Uses metadata such as supplier reliability, batch size, manufacturing location risk, blockchain verification status, transfer count, unexpected transfers, distribution duration deviation and complaint history
> - Uses simulated supply-chain scenarios to construct risk labels
> - SHAP is used for explainability
> - The system provides risk scoring, not definitive physical authentication.
>
> **Module 3 — Inventory Demand Forecasting**
>
> - LSTM and XGBoost Regression
> - Uses blockchain-verified historical order data
> - Features include medicine ID, region, month, historical demand, seasonal flag, complaint rate, expiry proximity and previous stockout flag
> - Evaluate using MAE and RMSE and deploy the better model.
>
> Blockchain is responsible for trusted/tamper-evident transaction history and provenance.
>
> MSSQL is responsible for application data and analytics storage.
>
> The Python ML API reads appropriate data from MSSQL, performs inference, and returns predictions to the ASP.NET backend.
>
> The admin dashboard must display:
>
> - supply-chain overview
> - blockchain provenance
> - anomaly alerts
> - fraud scores
> - counterfeit risk
> - SHAP explanations
> - demand forecasts
> - current stock
> - shortage alerts
>
> Customers should be able to scan a QR code associated with a medicine batch and view its provenance/history.
>
> Important constraints:
>
> - Do not claim that ML physically proves a medicine is counterfeit.
> - Clearly distinguish real transaction data from synthetically generated anomalies/risk scenarios.
> - Do not claim blockchain guarantees truthful physical-world information.
> - Maintain strict role-based access.
> - Do not mix Stratis into the implementation unless explicitly instructed; the current official architecture uses Algorand.
> - Build the system incrementally and keep frontend, ASP.NET backend, blockchain integration, ML service and database logically separated.
>
> When generating code, architecture, database schemas, APIs, models or documentation, remain consistent with this specification.

---

# 75. THE BIG PICTURE

At the end of the project, everything should fit into this simple sentence:

```
BLOCKCHAIN
     ↓
Trusted pharmaceutical history
     ↓
MACHINE LEARNING
     ↓
Detect → Assess → Predict
     ↓
ADMIN / SUPPLY-CHAIN DECISIONS
     ↓
Safer + More Transparent + More Intelligent Pharma Supply Chain

```

That is **the project**.