# Bhoomi-Drishti

**Geo-AI Predictive Soil Erosion Monitoring & Conservation Recommendation Platform**

A working MERN prototype built for Smart India Hackathon 2026.

---

## 1. Overview

Bhoomi-Drishti turns satellite and environmental observations into plot-level soil erosion
risk, flood and drought indicators, and ranked conservation recommendations — validated by
farmers on the ground.

### Problem

Soil erosion assessment across India is largely manual, slow and reactive. By the time
degradation is visible on the ground, topsoil and productivity have already been lost.

### Solution

Bhoomi-Drishti combines RUSLE soil-loss modelling, hydrological flow analysis, trend-based
erosion forecasting, and rule-based conservation recommendations into one visual, proactive
workflow — from satellite signal to recommended action, with citizen field photos closing the
validation loop.

---

## 2. Features

- **Interactive risk map** (React-Leaflet) with erosion / flood / drought layers, hydrological
  flow paths, priority-zone polygons, and citizen report pins
- **RUSLE engine** — fully transparent `A = R × K × LS × C × P` calculation with a factor-by-factor
  breakdown, never a black box
- **Flood & drought risk indicators** — transparent, weighted demo indices extending the
  platform beyond erosion alone
- **Erosion forecasting** — a transparent JS trend-based projection (not a trained ML model),
  visualized historical → current → next-season
- **Hydrological prioritization** — demo flow-path and priority-zone GeoJSON showing where
  conservation intervention should be focused
- **Conservation recommendation engine** — rule-based interventions (check dams, contour
  bunding, farm ponds, agroforestry, vegetative barriers) each with a reason, expected impact,
  and priority
- **AI / rule-based explanations** — optional AI-generated farmer-friendly summaries (Anthropic
  API), with a deterministic rule-based fallback when no key is configured
- **Citizen photo validation** — farmers submit field reports; officers confirm/reject them,
  simulating the satellite-prediction ↔ ground-observation confidence loop
- **Priority zones** — all six demo regions ranked by combined erosion/flood/drought risk
- **JWT authentication** with farmer/officer roles, plus a **"Continue with Demo Account"**
  shortcut that works with or without a database
- **Demo Mode by default** — the entire application runs immediately with a seeded, deterministic
  dataset. No MongoDB, GEE, or AI credentials are required.

---

## 3. Architecture

```
Satellite / Environmental Data (Sentinel-1/2, SRTM, CHIRPS, SoilGrids)
        -> Data Processing (satelliteService.js; demo dataset or future GEE integration)
        -> RUSLE Soil-Loss Estimation (rusleService.js)
        -> Hydrological Analysis (hydrologyService.js)
        -> Erosion Risk Prediction (forecastService.js)
        -> Flood / Drought Risk Indicators (riskService.js)
        -> AI Conservation Recommendations (recommendationService.js + aiService.js)
        -> Citizen Photo Validation (citizenController.js)
        -> MERN Dashboard (React + Express + MongoDB)
```

The application has two clearly separated data modes:

- **DEMO MODE** (default): seeded, deterministic environmental data for six Indian regions.
  Works immediately with no external credentials.
- **LIVE MODE**: activated automatically when `GEE_PROJECT_ID` is configured. `satelliteService.js`
  exposes the same function signatures (`getSentinelData`, `getRainfallData`,
  `getElevationData`, `getSoilData`, `getNDVIData`) that a real Google Earth Engine integration
  would implement — swapping in live data requires no controller changes.

The UI always shows a **Demo Data** / **Live Satellite Data** badge so the data source is never
misrepresented.

---

## 4. Tech Stack

**Frontend:** React, Vite, Tailwind CSS v4, React Router, React-Leaflet, Recharts, Axios, Lucide React

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT authentication

No Python, Django, Flask, or separate ML microservices are used anywhere in this project.

---

## 5. Folder Structure

```
bhoomi-drishti/
  server/
    config/db.js
    models/            User, Region, Analysis, CitizenReport, Recommendation
    controllers/        auth, region, analysis, recommendation, citizen
    routes/
    services/           rusleService, riskService, forecastService,
                         hydrologyService, recommendationService,
                         satelliteService, aiService
    middleware/authMiddleware.js
    data/                demoRegions.js, demoAnalysis.js
    server.js
    .env.example

  client/
    src/
      api/client.js
      context/           AuthContext, RegionContext
      hooks/              useAnalysis, usePriorityZones
      components/         AppLayout, MapView, Charts, RusleBreakdown,
                           RecommendationCard, Badges, States, StatCard,
                           ProtectedRoute
      pages/               Landing, Login, Register, Dashboard, Analysis,
                            RiskMap, PriorityZones, Recommendations,
                            CitizenValidation, About
    index.html
    vite.config.js

  README.md
```

---

## 6. Setup Instructions

### Prerequisites

- Node.js 18+
- npm
- (Optional) MongoDB instance — a local `mongod` or a MongoDB Atlas connection string

### Install

```bash
# from the project root
cd server && npm install
cd ../client && npm install
```

### Environment variables

Copy the example env file and edit as needed:

```bash
cd server
cp .env.example .env
```

`server/.env`:

```env
# Optional. Leave empty to run in DEMO MODE with no persistence.
MONGO_URI=

# Secret used to sign JWTs. Set a strong random value in production.
JWT_SECRET=

# Optional. Enables AI-generated explanations via the Anthropic API.
# Leave empty to use the deterministic rule-based explanation engine.
AI_API_KEY=

# Optional. Google Earth Engine project id. Leave empty to stay in DEMO MODE.
GEE_PROJECT_ID=

PORT=5000
```

The application runs fully — dashboard, map, RUSLE, forecasting, recommendations, citizen
validation — with **all four optional variables left empty**.

### Start the backend

```bash
cd server
npm start
# API available at http://localhost:5000
# Health check: GET http://localhost:5000/api/health
```

### Start the frontend

```bash
cd client
npm run dev
# App available at http://localhost:5173
# /api requests are proxied to http://localhost:5000 (see client/vite.config.js)
```

### Demo credentials

No registration needed — on the **Sign in** page, click:

- **Continue with Demo Account (Farmer)** — view risk, recommendations, submit field photos
- **Continue with Demo Account (Officer)** — regional dashboard, priority zones, validate citizen reports

These work even without a MongoDB connection.

---

## 7. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user (requires DB connection) |
| POST | `/api/auth/login` | Log in (requires DB connection) |
| POST | `/api/auth/demo-login` | Get a demo JWT for `farmer` or `officer` role — no DB required |
| GET | `/api/regions` | List all demo regions |
| GET | `/api/regions/:id` | Full demo dataset for one region |
| POST | `/api/analysis/rusle` | Run the RUSLE calculation for given/region factors |
| POST | `/api/analysis/forecast` | Trend-based erosion forecast for a region |
| POST | `/api/analysis/risk` | Flood + drought risk indicators for a region |
| POST | `/api/analysis/run` | **Main orchestration endpoint** — full analysis object |
| GET | `/api/priority-zones` | All regions ranked by combined risk |
| POST | `/api/recommendations/generate` | Generate recommendations for a region |
| GET | `/api/recommendations/:regionId` | Recommendations for a region |
| POST | `/api/citizen-reports` | Submit a field report |
| GET | `/api/citizen-reports` | List field reports |
| PATCH | `/api/citizen-reports/:id/validate` | Confirm/reject a report (updates model confidence) |
| GET | `/api/health` | Data mode, DB/AI/GEE status |

All responses are JSON with a `success` boolean. Errors return a `message` field and an
appropriate HTTP status code; the API never crashes the process on a bad request.

---

## 8. Which Parts Use Demo Data

- All six regions (Assam, Bihar, Uttar Pradesh, Odisha, Rajasthan, West Bengal) use a seeded,
  deterministic dataset in `server/data/demoRegions.js` and `server/data/demoAnalysis.js`.
- RUSLE, flood/drought risk, forecasting, hydrology and recommendations are calculated
  **deterministically from these demo inputs** — the math itself is real, only the environmental
  inputs are simulated.
- Citizen reports are stored in MongoDB when connected, or in an in-memory store (with two
  seeded example reports) when no database is configured.

## 9. What's Ready for Live Satellite/GEE Integration

`server/services/satelliteService.js` is the single integration point. It already exposes the
function signatures a real GEE-backed implementation would need
(`getSentinelData`, `getRainfallData`, `getElevationData`, `getSoilData`, `getNDVIData`). To go
live:

1. Set `GEE_PROJECT_ID` (and any GEE service-account credentials your integration needs) in `server/.env`.
2. Replace the body of each function in `satelliteService.js` with a real Earth Engine query.
3. No controller or frontend changes are required — `getDataMode()` will automatically report
   `LIVE`, and the UI's Data Mode badge updates accordingly.

`aiService.js` is similarly pluggable: set `AI_API_KEY` to enable AI-generated explanations via
the Anthropic API; leave it empty to keep the deterministic rule-based explanation engine.

---

## 10. SIH Demo Flow (3–5 minutes)

1. **Open the Dashboard.** Sign in with the Demo Account (Officer).
2. **Select Assam.** Dashboard updates: High erosion, High flood risk, rainfall anomaly, NDVI, priority zone.
3. **Click the Assam marker on the map.** See the detailed popup with soil loss, flood/drought risk, and priority.
4. **Open the RUSLE breakdown.** Show `A = R × K × LS × C × P` and the calculated soil loss.
5. **Open the Forecast chart.** Show the next-season erosion projection and confidence.
6. **Show Hydrological Analysis** (on the Analysis page). Explain how runoff concentration drives prioritization.
7. **Show Recommendations** — e.g. Check Dams, Contour Bunding, Farm Ponds — each with a reason and expected impact.
8. **Open Citizen Validation.** Show a farmer-submitted report and confirm it, watching model confidence increase.
9. **Switch to Rajasthan.** Show the very different risk profile: low erosion, moderate drought risk, drought-specific recommendations (Farm Ponds & Moisture Conservation, Agroforestry).

---

## 11. Future Scope

- Live Google Earth Engine integration for Sentinel-1/2, SRTM, CHIRPS and SoilGrids
- Real flow-direction / flow-accumulation raster hydrology (currently demo GeoJSON)
- District-level drill-down beyond the six seeded state-level regions
- SMS/WhatsApp-based citizen reporting for low-connectivity areas
- Model retraining pipeline driven by confirmed citizen validations
- Role-based multi-department access control and audit trails

---

## 12. Scientific Transparency Notice

All soil-loss, flood-risk, drought-risk and forecast figures in Demo Mode are **estimates
derived from a seeded demo dataset**, not live satellite measurements. The application always
labels results as "Estimated" and displays a Demo Data / Live Satellite Data indicator. Flood
and drought indices are transparent, rule-based demo indicators — they are explicitly not
represented as officially validated meteorological or hydrological models.
