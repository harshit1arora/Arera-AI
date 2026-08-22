# Gavel AI — Enterprise Lending Infrastructure Platform b2b + b2c

> **API Gateway + React Dashboard** for NBFCs, fintechs, and lenders to automate the full lending lifecycle: origination, underwriting, disbursement, repayment, collections, compliance, and ROI reporting.

[![CI](https://github.com/gavel-ai/gavel-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/gavel-ai/gavel-ai/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-20+-blue.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.9-blue.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## What is it?

Gavel AI is a **composable lending infrastructure platform** — not a monolithic LMS. Lenders plug in only the modules they need via REST APIs, while the dashboard provides end-to-end operational visibility.

**Core modules:**
- Loan origination & application workflow automation
- AI-powered underwriting copilot (Gemini / Nvidia Llama)
- Bank statement PDF parsing + cash flow analysis
- Automated disbursement (Razorpay Banking / Setu)
- EMI repayment scheduling + tracking
- Collections management with automated NPA alerts
- RBI compliance engine (SMA/NPA classification, provisioning, LAR reports)
- Multi-tenant API gateway with per-org quota enforcement
- Webhook queue with HMAC signing + exponential backoff retry
- Partner/BaaS management + commission tracking
- Agent performance & commission management
- Slack real-time alerts (deals, collections, NPA, compliance)

---

## Architecture

```
Frontend (React + Vite + shadcn/ui)      Backend (Express + TypeScript)
         │                                        │
         └── Firebase Auth (ID Token) ──────────────┤
                                                   │
         ┌────────────── REST API ───────────────────┘
         │                                        │
    Dashboard UI ──── API Key Auth ────────── API Gateway
                     Firebase Token Auth      (40+ endpoints)

         ┌──────────────────────────────────────────┐
         │               Firestore                    │
         │  loans | repayments | collections |        │
         │  audit_logs | api_keys | workflows | ... │
         └──────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
         Redis (workflow state,    Razorpay / Twilio /
         cache, queues)            SendGrid / Setu / CIBIL
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (for containerized setup)
- Firebase project (for Auth + Firestore)

### 1. Clone & install

```bash
git clone https://github.com/gavel-ai/gavel-ai.git
cd gavel-ai

# Backend
cd backend && npm install

# Frontend
cd .. && npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

**Required variables:**
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
FIREBASE_PROJECT_ID=your-project

# Security (generate with: openssl rand -base64 32)
JWT_SECRET=your-jwt-secret-min-32-chars
WEBHOOK_SIGNING_SECRET=your-webhook-secret-min-32-chars

# Optional but recommended for live integrations
GEMINI_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

### 3. Start services

```bash
# Option A: Docker Compose (recommended)
docker compose up

# Option B: Manual
cd backend && npm run dev     # http://localhost:8080
npm run dev                  # http://localhost:5173
```

### 4. Run tests

```bash
cd backend && npm test
```

---

## API Reference

Full API documentation available at `http://localhost:8080/docs` once running.

### Authentication

Two auth modes — use whichever fits your use case:

**Firebase ID Token** (dashboard/console operations):
```
Authorization: Bearer <firebase_id_token>
```

**API Key** (programmatic/SDK access):
```
Authorization: Bearer sk_live_<your_api_key>
```

### Key Endpoints

| Route | Description |
|---|---|
| `POST /v1/evaluate` | AI-powered loan evaluation |
| `POST /v1/evaluate/bank-statement` | Parse PDF bank statement |
| `POST /v1/workflow/start` | Start loan application workflow |
| `POST /v1/copilot` | AI underwriting copilot chat |
| `POST /v1/disbursement/initiate` | Automated disbursement |
| `GET /v1/collections` | Collections pipeline |
| `GET /v1/rbi/portfolio-classification` | RBI NPA classification |
| `POST /v1/rbi/provisioning-report` | Provisioning report |
| `GET /v1/rbi/rbi-report/:type` | RBI compliance reports |
| `POST /v1/slack/alerts/:type` | Slack real-time alerts |
| `POST /v1/notifications/send` | SMS/Email notifications |
| `GET /v1/portfolio` | Portfolio analytics |

---

## Project Structure

```
gavel-ai/
├── backend/
│   └── src/
│       ├── config/          Firebase Admin SDK
│       ├── middleware/      auth.ts, quota.ts
│       ├── routes/          40+ Express route files
│       ├── services/        26 service modules
│       └── index.ts         App entry point
├── src/
│   ├── pages/              40+ React page components
│   ├── components/         shadcn/ui + custom
│   ├── lib/                api-client, firebase, utils
│   └── hooks/              React Query hooks
├── k8s/                    Kubernetes manifests
├── .github/workflows/      CI/CD pipeline
├── docker-compose.yml
├── Dockerfile.frontend
└── nginx.conf
```

---

## Security

- **API keys stored as SHA-256 hashes only** — plaintext never saved
- **Multi-tenant isolation** — every query scoped to `orgId`
- **Webhook signature verification** (HMAC-SHA256, timing-safe)
- **Rate limiting** — 100 req/min per IP, 20 auth attempts/15 min
- **Input sanitization** — all user inputs sanitized, orgId regex validated
- **CORS locked** to configured origins only
- **Helmet.js** secure HTTP headers
- **JWT** with HS256 algorithm + jti replay protection
- **Graceful shutdown** with SIGTERM/SIGINT handling

---

## Deployment

### Docker Compose (local/staging)

```bash
docker compose up -d
```

### Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/base/

# Set secrets (replace values)
kubectl create secret generic gavel-backend-secrets \
  --from-literal=JWT_SECRET=your-secret \
  --from-literal=WEBHOOK_SIGNING_SECRET=your-secret \
  --from-literal=FIREBASE_SERVICE_ACCOUNT="$(cat service-account.json | base64)" \
  -n default
```

---

## Environment Variables

See `.env.example` for all configurable variables. Critical for production:

| Variable | Required | Description |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Yes | Firebase Admin SDK JSON |
| `JWT_SECRET` | Yes | Min 32 chars. Used for borrower JWT signing |
| `WEBHOOK_SIGNING_SECRET` | Yes | Min 32 chars. Used for webhook HMAC signing |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Razorpay webhook signature verification |
| `GEMINI_API_KEY` | Recommended | Gemini AI for underwriting copilot |
| `NVIDIA_API_KEY` | Optional | Nvidia Llama for bank statement parsing | - not used

---

## Roadmap

- [ ] PostgreSQL adapter (in addition to Firestore)
- [ ] Real-time WebSocket events
- [ ] SOC2 / ISO 27001 compliance documentation
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Co-lending workflow automation
- [ ] Plugin marketplace (partner integrations)

---

## License

MIT
