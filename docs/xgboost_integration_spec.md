# XGBoost Cycle Irregularity Prediction — Model Integration Specification

> **Feature:** Cycle Insights & Forecast — PCOS Saathi  
> **Status:** Interface Ready & Baseline Operational (Production Baseline: `baseline-clinical-rules-v1.0`)  
> **Target Future Model:** Binary / Multi-class XGBoost Classifier (`xgboost-cycle-classifier-v1.0`)  

---

## 1. Executive Summary & Design Contract

PCOS Saathi uses a modular, two-tier prediction service architecture defined in [`src/services/cyclePredictionService.js`](../src/services/cyclePredictionService.js):

1. **`BaselineCyclePredictionService` (Active in Production)**:
   - Transparent, deterministic rules based on clinical guidelines from ACOG (Practice Bulletin No. 128) and FIGO.
   - Calculates consecutive cycle lengths, average cycle length, shortest/longest cycles, variation, and projected upcoming date window.
   - Outputs `engineType: 'rule_based'`, `confidenceScore: null` (explicitly zero fake ML probabilities).

2. **`XGBoostCyclePredictionService` (Model-Ready Stub & Connector)**:
   - Extends the abstract `CyclePredictionService` base class.
   - When no external model endpoint is provided (`VITE_XGBOOST_CYCLE_API_URL` is undefined), it delegates to `BaselineCyclePredictionService` without UI interruption.
   - When a trained model endpoint is configured, it sends standardized feature payloads and maps predictions into the identical `PredictionResult` schema.

Because both services implement the identical `predict(cycleEntries, profileContext)` signature and return the identical `PredictionResult` schema, **swapping from Baseline to real XGBoost requires zero UI or database modifications**.

---

## 2. Standard Feature Payload Contract (Frontend -> Python Backend)

When calling the external XGBoost endpoint (`POST /api/cycle/predict-xgboost` or configured URL), the client provides this JSON payload:

```json
{
  "age": 24,
  "total_cycles_recorded": 4,
  "average_cycle_length": 42.5,
  "min_cycle_length": 40,
  "max_cycle_length": 45,
  "cycle_variation": 5,
  "recent_cycle_lengths": [40, 42, 43, 45],
  "average_pain_score": 3.5,
  "flow_level_distribution": {
    "spotting": 0,
    "light": 1,
    "medium": 2,
    "heavy": 1
  }
}
```

### Feature Definitions:
| Feature | Type | Range / Format | Description |
| :--- | :--- | :--- | :--- |
| `age` | `int \| null` | 10 – 60 | User age in years (optional) |
| `total_cycles_recorded` | `int` | $\ge 1$ | Completed consecutive cycle intervals |
| `average_cycle_length` | `float` | 15.0 – 120.0 | Mean cycle length across history |
| `min_cycle_length` | `int` | 15 – 120 | Shortest cycle in days |
| `max_cycle_length` | `int` | 15 – 120 | Longest cycle in days |
| `cycle_variation` | `int` | $\ge 0$ | Max minus min cycle length |
| `recent_cycle_lengths` | `int[]` | Array of $\le 6$ ints | Most recent chronological cycle lengths |
| `average_pain_score` | `float` | 0.0 – 10.0 | Mean reported dysmenorrhea score |

---

## 3. Standard Model Response Contract (Python Backend -> Frontend)

The future Python/XGBoost endpoint must respond with HTTP 200 and JSON conforming to:

```json
{
  "status": "success",
  "irregularityCategory": "irregular",
  "estimatedIrregularity": true,
  "calibratedProbability": 0.82,
  "uncertaintyInfo": {
    "description": "Model calibrated via Platt scaling on 10-fold cross validation.",
    "variationDays": 5,
    "hasSufficientData": true
  },
  "explanation": "Elevated probability of upcoming cycle irregularity due to recent consecutive cycles extending past 35 days (oligomenorrhea pattern).",
  "warnings": [],
  "expectedNextPeriod": {
    "earliestDate": "2026-05-04",
    "latestDate": "2026-05-08",
    "mostLikelyDate": "2026-05-06",
    "daysUntilWindow": 12,
    "windowText": "May 4 – May 8, 2026"
  },
  "modelVersion": "xgboost-cycle-classifier-v1.0",
  "engineType": "ml_xgboost",
  "disclaimer": "This is information, not a diagnosis."
}
```

---

## 4. Python Implementation Blueprint (`backend/app/services/xgboost_service.py`)

When training is complete, the Python service can be loaded with standard `xgboost`:

```python
import xgboost as xgb
import numpy as np

class XGBoostCycleModel:
    def __init__(self, model_path: str = "models/xgboost_cycle_v1.json"):
        self.booster = xgb.Booster()
        self.booster.load_model(model_path)

    def predict_irregularity(self, features: dict) -> dict:
        feature_vector = np.array([[
            features.get("age") or 25.0,
            features["average_cycle_length"],
            features["min_cycle_length"],
            features["max_cycle_length"],
            features["cycle_variation"],
            features.get("average_pain_score") or 0.0,
        ]])
        
        dmatrix = xgb.DMatrix(feature_vector)
        raw_prob = float(self.booster.predict(dmatrix)[0])
        is_irregular = raw_prob >= 0.5
        
        return {
            "estimatedIrregularity": is_irregular,
            "calibratedProbability": round(raw_prob, 3),
            "irregularityCategory": "irregular" if is_irregular else "regular",
            "modelVersion": "xgboost-cycle-classifier-v1.0",
        }
```

---

## 5. Client Activation Protocol

To activate the real XGBoost model in production:

1. Deploy the model endpoint (e.g. `/api/cycle/predict-xgboost` on FastAPI backend).
2. Set environment variable in `.env`:
   ```env
   VITE_XGBOOST_CYCLE_API_URL=http://localhost:8000/api/cycle/predict-xgboost
   ```
3. In `src/services/cyclePredictionService.js`, switch default export:
   ```javascript
   export const defaultPredictionService = new XGBoostCyclePredictionService();
   ```
4. If the service experiences downtime, the client automatically catches errors and reverts to `BaselineCyclePredictionService` with zero user disruption.
