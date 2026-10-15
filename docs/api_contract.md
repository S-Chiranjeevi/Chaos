# PCOS Saathi — API & Schema Contracts Specification

> **Version:** 3.0.0  
> **Status:** Final Architectural Contract  
> **Design Principle:** Offline-first client contracts with optional, stateless FastAPI endpoints. **Zero remote database persistence.**

---

## 1. Architectural Interface Topology

PCOS Saathi uses two tiers of interface contracts:
1. **Client-Side Event & Storage Contracts** *(Primary & Mandatory)*: Reactive interfaces between the 7 product areas, `StorageService`, and `EventBus`.
2. **Stateless FastAPI REST Contracts** *(Optional & Ephemeral)*: Ephemeral endpoints for enhanced NLP/extraction. **FastAPI stores no data, uses no database, and has zero persistent state.**

---

## 2. Canonical Shared Schemas

All schemas are implemented in JavaScript at [`src/models/pcosSaathiSchemas.js`](file:///c:/Users/spurv/OneDrive/Documents/choas/src/models/pcosSaathiSchemas.js).

### 2.1 `HealthEntry` Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "HealthEntry",
  "type": "object",
  "required": ["id", "timestamp", "version", "language", "inputMode", "rawTranscript", "symptoms"],
  "properties": {
    "id": { "type": "string", "example": "he-1729000000-abc" },
    "timestamp": { "type": "string", "format": "date-time" },
    "version": { "type": "string", "enum": ["1.0.0", "3.0.0"] },
    "language": { "type": "string", "enum": ["en", "hi", "kn", "ta", "ml"] },
    "inputMode": { "type": "string", "enum": ["speech", "text", "manual"] },
    "rawTranscript": { "type": "string" },
    "symptoms": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "duration", "frequency", "severity", "category"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "duration": { "type": "string" },
          "frequency": { "type": "string" },
          "severity": { "type": "string", "enum": ["Mild", "Moderate", "Severe", "Unspecified"] },
          "category": { "type": "string", "enum": ["Hormonal", "Cycle", "Pain", "Metabolic", "Mood", "General"] },
          "isCustom": { "type": "boolean" }
        }
      }
    },
    "notes": { "type": "string" },
    "tags": { "type": "array", "items": { "type": "string" } },
    "vitals": {
      "type": "object",
      "properties": {
        "weightKg": { "type": ["number", "null"] },
        "bpSystolic": { "type": ["number", "null"] },
        "bpDiastolic": { "type": ["number", "null"] },
        "sleepHours": { "type": ["number", "null"] },
        "stressLevel": { "type": ["number", "null"], "minimum": 1, "maximum": 5 }
      }
    },
    "safety": { "$ref": "#/definitions/SafetyResult" },
    "metadata": { "type": "object" }
  }
}
```

### 2.2 `CycleEntry` Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CycleEntry",
  "type": "object",
  "required": ["id", "startDate", "flowLevel", "painScore", "timestamp"],
  "properties": {
    "id": { "type": "string", "example": "cy-1729000000-xyz" },
    "startDate": { "type": "string", "format": "date", "example": "2026-10-01" },
    "endDate": { "type": ["string", "null"], "format": "date" },
    "cycleLengthDays": { "type": ["number", "null"], "example": 28 },
    "periodDurationDays": { "type": ["number", "null"], "example": 5 },
    "flowLevel": { "type": "string", "enum": ["spotting", "light", "medium", "heavy"] },
    "painScore": { "type": "number", "minimum": 0, "maximum": 10 },
    "associatedSymptoms": { "type": "array", "items": { "type": "string" } },
    "notes": { "type": "string" },
    "timestamp": { "type": "string", "format": "date-time" }
  }
}
```

### 2.3 `Insight` Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Insight",
  "type": "object",
  "required": ["id", "generatedAt", "category", "title", "summary", "confidence", "suggestedAction", "disclaimer"],
  "properties": {
    "id": { "type": "string" },
    "generatedAt": { "type": "string", "format": "date-time" },
    "category": { "type": "string", "enum": ["cycle_regularity", "symptom_progression", "cluster_correlation", "lifestyle"] },
    "title": { "type": "string" },
    "summary": { "type": "string" },
    "details": { "type": "array", "items": { "type": "string" } },
    "evidenceEntries": { "type": "array", "items": { "type": "string" } },
    "confidence": { "type": "string", "enum": ["high", "moderate", "exploratory"] },
    "suggestedAction": { "type": "string" },
    "disclaimer": { "type": "string" }
  }
}
```

### 2.4 `DoctorSummary` Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DoctorSummary",
  "type": "object",
  "required": ["id", "generatedAt", "patientProfile", "timeframe", "symptomFrequency", "cycleMetrics", "activeRedFlags", "keyInsights", "questionsForClinician", "printableText", "disclaimer"],
  "properties": {
    "id": { "type": "string" },
    "generatedAt": { "type": "string", "format": "date-time" },
    "patientProfile": {
      "type": "object",
      "properties": {
        "preferredLanguage": { "type": "string" },
        "ageRange": { "type": "string" },
        "primaryConcerns": { "type": "array", "items": { "type": "string" } }
      }
    },
    "timeframe": {
      "type": "object",
      "required": ["fromDate", "toDate", "totalEntriesCount"],
      "properties": {
        "fromDate": { "type": "string" },
        "toDate": { "type": "string" },
        "totalEntriesCount": { "type": "number" }
      }
    },
    "symptomFrequency": { "type": "object", "additionalProperties": { "type": "number" } },
    "cycleMetrics": {
      "type": "object",
      "properties": {
        "averageCycleDays": { "type": ["number", "null"] },
        "longestCycle": { "type": ["number", "null"] },
        "shortestCycle": { "type": ["number", "null"] },
        "irregularityScore": { "type": "string", "enum": ["regular", "variable", "irregular", "unknown"] }
      }
    },
    "activeRedFlags": { "type": "array", "items": { "$ref": "#/definitions/RedFlag" } },
    "keyInsights": { "type": "array", "items": { "$ref": "#/definitions/Insight" } },
    "questionsForClinician": { "type": "array", "items": { "type": "string" } },
    "printableText": { "type": "string" },
    "disclaimer": { "type": "string" }
  }
}
```

### 2.5 `RedFlag` Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RedFlag",
  "type": "object",
  "required": ["id", "ruleId", "title", "description", "urgencyLevel", "actionPrompt", "emergencyHelpline", "detectedAt"],
  "properties": {
    "id": { "type": "string" },
    "ruleId": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "urgencyLevel": { "type": "string", "enum": ["emergency", "urgent_clinical", "routine_followup"] },
    "actionPrompt": { "type": "string" },
    "emergencyHelpline": { "type": "string", "default": "108" },
    "detectedAt": { "type": "string", "format": "date-time" },
    "triggerKeywords": { "type": "array", "items": { "type": "string" } }
  }
}
```

### 2.6 `SafetyResult` Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "SafetyResult",
  "type": "object",
  "required": ["isSafe", "hasRedFlags", "redFlags", "blockedPrescriptions", "sanitizedText", "disclaimer", "checkedAt"],
  "properties": {
    "isSafe": { "type": "boolean" },
    "hasRedFlags": { "type": "boolean" },
    "redFlags": { "type": "array", "items": { "$ref": "#/definitions/RedFlag" } },
    "blockedPrescriptions": { "type": "array", "items": { "type": "string" } },
    "sanitizedText": { "type": "string" },
    "disclaimer": { "type": "string" },
    "checkedAt": { "type": "string", "format": "date-time" }
  }
}
```

---

## 3. Client EventBus Communication Contract

Components interact via the EventBus exposed in [`src/services/eventBus.js`](file:///c:/Users/spurv/OneDrive/Documents/choas/src/services/eventBus.js).

| Event Name | Dispatcher | Consumers | Payload (`detail`) |
| :--- | :--- | :--- | :--- |
| `pcos_saathi:data_change` | `StorageService` | `HomeView`, `TrackerView`, `InsightsView` | `{ key: string, data: any, timestamp: string }` |
| `pcos_saathi:red_flag_triggered` | `patternDetectionService.js` | `App.jsx`, `Header.jsx`, `GlobalError.jsx` | `{ redFlags: RedFlag[], highestUrgency: string }` |
| `pcos_saathi:navigate_request` | Any component CTA | `App.jsx` (Router) | `{ path: string, state?: object }` |
| `pcos_saathi:language_changed` | `LanguageSelector.jsx` | `TalkOrType.jsx`, `Header.jsx` | `{ languageCode: string, nativeName: string }` |
| `pcos_saathi:data_purged` | `PrivacyControls.jsx` | All mounted components | `{ purgedAt: string }` |

---

## 4. Optional FastAPI Microservice Contract

The FastAPI backend is completely **stateless**. It **stores no patient records, writes to no databases, and discards input immediately after returning the JSON response**.

### 4.1 `GET /api/v1/health`
**Purpose:** Verify service availability and latency.

- **Request:** None
- **Response `200 OK`:**
  ```json
  {
    "status": "healthy",
    "version": "3.0.0",
    "mode": "stateless_ephemeral",
    "database": false,
    "timestamp": "2026-10-15T15:30:00Z"
  }
  ```

---

### 4.2 `POST /api/v1/extract-symptoms`
**Purpose:** Stateless NLP extraction of structured symptoms from raw multilingual text/transcript.

- **Request Body (`application/json`):**
  ```json
  {
    "raw_transcript": "Meri periods pichle teen mahine se late ho rahi hain aur chehre pe bahut baal aa rahe hain.",
    "language": "hi",
    "options": {
      "normalize_to_english": true
    }
  }
  ```

- **Response `200 OK`:**
  ```json
  {
    "symptoms": [
      {
        "id": "sym-1",
        "name": "Irregular Periods",
        "duration": "3 months",
        "frequency": "Continuous",
        "severity": "Moderate",
        "category": "Cycle",
        "isCustom": false
      },
      {
        "id": "sym-2",
        "name": "Facial Hair (Hirsutism)",
        "duration": "Unspecified",
        "frequency": "Noticeable",
        "severity": "Mild",
        "category": "Hormonal",
        "isCustom": false
      }
    ],
    "safety": {
      "isSafe": true,
      "hasRedFlags": false,
      "redFlags": [],
      "blockedPrescriptions": [],
      "sanitizedText": "Periods delayed for 3 months, facial hair noticeable.",
      "disclaimer": "PCOS Saathi provides educational, non-diagnostic guidance to support clinical conversations.",
      "checkedAt": "2026-10-15T15:30:02Z"
    }
  }
  ```

- **Error Response `400 Bad Request`:**
  ```json
  {
    "error": "EMPTY_TRANSCRIPT",
    "message": "Input text cannot be blank."
  }
  ```

---

### 4.3 `POST /api/v1/synthesize-summary`
**Purpose:** Synthesizes aggregated numbers and symptoms into doctor-facing consultation notes.

- **Request Body (`application/json`):**
  ```json
  {
    "symptom_frequency": { "Irregular Periods": 3, "Acne": 2 },
    "cycle_metrics": { "averageCycleDays": 45, "irregularityScore": "irregular" },
    "active_red_flags": [],
    "language": "en"
  }
  ```

- **Response `200 OK`:**
  ```json
  {
    "doctor_summary": {
      "questionsForClinician": [
        "Given the 45-day average cycle length over the past 3 cycles, should we schedule a pelvic ultrasound or hormonal panel (LH, FSH, Free Testosterone)?",
        "Are there lifestyle and nutritional adjustments to address cystic acne alongside menstrual irregularities?"
      ],
      "printableText": "PCOS Saathi Clinical Overview\n- Average cycle length: 45 days (irregular)\n- Logged symptoms: Irregular Periods (3x), Acne (2x)\n- Red flags: None detected\n- Note: Patient seeks evaluation for oligomenorrhea.",
      "disclaimer": "PCOS Saathi provides educational, non-diagnostic guidance to support clinical conversations."
    }
  }
  ```

---

## 5. Client Fallback Contract

If any FastAPI endpoint returns a non-200 code or fails with a network exception:
```javascript
// Guaranteed Fallback Contract
try {
  return await callFastApiEndpoint(payload);
} catch (networkOrServerError) {
  // 1. Log warning locally without throwing unhandled exceptions
  console.warn('[FastAPI Fallback] Falling back to offline client rule engine:', networkOrServerError.message);

  // 2. Return local deterministic rule output conforming EXACTLY to the same schema
  return deterministicClientFallback(payload);
}
```
No user-facing error dialog is shown when FastAPI is unreachable; the client simply computes the result locally using `symptomExtractor.js` or `patternDetectionService.js`.
