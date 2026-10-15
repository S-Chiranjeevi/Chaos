# PCOS Saathi — Stateless FastAPI Microservice

An optional, ephemeral microservice for multilingual symptom analysis, menstrual cycle regularity tracking, and clinician pre-consultation summary synthesis.

---

## 🛡️ Core Invariants

1. **Zero Database**: No MongoDB, PostgreSQL, SQLite, or Firebase.
2. **Strictly Stateless**: No health entries, symptoms, dates, or transcripts are permanently saved or cached on the server.
3. **Privacy-First**: Never logs raw symptom text, notes, or patient inputs.
4. **Offline Local Fallback**: When `GEMINI_API_KEY` is absent or the AI service times out, requests automatically resolve using the deterministic local clinical rule engine.
5. **Secure**: API keys are isolated via environment variables and never returned in responses, errors, or logs.

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional Google Gemini API key for AI synthesis | `""` (runs in local fallback mode) |
| `FRONTEND_ORIGIN` | Allowed origin for CORS (comma-separated for multiple) | `http://localhost:5173` |
| `ENVIRONMENT` | Environment name | `development` |
| `HOST` | Bind host | `0.0.0.0` |
| `PORT` | Bind port | `8000` |

### 3. Run the Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive OpenAPI documentation will be accessible at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 4. Run Test Suite
```bash
pytest tests -v
```

---

## 📡 API Endpoints

### 1. `GET /api/health`
Health check and liveness probe.
```json
{
  "status": "ok"
}
```

### 2. `POST /api/analyze`
Stateless symptom extraction, clinical relation, and triage.

**Request:**
```json
{
  "text": "My periods come every two or three months",
  "language": "en",
  "age": 22
}
```

**Response:**
```json
{
  "detected_language": "en",
  "symptoms": ["Irregular or infrequent periods"],
  "possible_relation": "Menstrual cycles that arrive every 2 to 3 months...",
  "urgency": "soon",
  "red_flags": [],
  "recommended_specialist": "gynecologist",
  "questions_for_doctor": [
    "What clinical evaluations (such as pelvic ultrasound or hormone blood tests) are recommended for my cycle pattern?"
  ],
  "self_care_tips": [
    "Focus on balanced, nutrient-dense meals containing fiber, healthy fats, and protein..."
  ],
  "disclaimer": "This is information, not a diagnosis.",
  "reply_text": "Thank you for sharing what you are experiencing..."
}
```

### 3. `POST /api/cycle`
Menstrual cycle intervals, statistics, and regularity patterns.

**Request:**
```json
{
  "period_start_dates": [
    "2026-01-01",
    "2026-02-10",
    "2026-03-25"
  ]
}
```

**Response:**
```json
{
  "cycles": [
    { "start_date": "2026-01-01", "end_date": "2026-02-10", "length_days": 40 },
    { "start_date": "2026-02-10", "end_date": "2026-03-25", "length_days": 43 }
  ],
  "average_cycle_length": 41.5,
  "shortest_cycle": 40,
  "longest_cycle": 43,
  "variation_days": 3,
  "regularity": "irregular",
  "predicted_next_period": "2026-05-06",
  "insights": [
    "Your average cycle length is 41.5 days, with cycles reaching up to 43 days..."
  ],
  "urgency": "routine",
  "disclaimer": "This is information, not a diagnosis."
}
```

### 4. `POST /api/summary`
1-Page Clinician Pre-Consultation Summary synthesis.

**Request:**
```json
{
  "symptoms": ["Irregular periods", "Acne"],
  "duration": "3 months",
  "cycle_data": {
    "averageCycleDays": 42
  },
  "insights": [],
  "language": "en"
}
```
