# PCOS Saathi — Master Project Architecture & Frontend Shell

> **Role:** Lead Architect  
> **Status:** Final Architectural Baseline (Hackathon Edition)  
> **Documentation:** [docs/architecture.md](docs/architecture.md) · [docs/api_contract.md](docs/api_contract.md) · [docs/integration_checklist.md](docs/integration_checklist.md)  
> **Core Invariant:** Zero remote database (No MongoDB, PostgreSQL, Firebase). 100% offline-first local persistence via `localStorage`/`IndexedDB`.

---

## 🌟 Architectural Overview

**PCOS Saathi** is an empathetic, multilingual, privacy-first companion designed to help women navigate Polycystic Ovary Syndrome (PCOS) and reproductive health.

The application is decomposed into **7 distinct product areas**, connected via a decoupled event bus, persisting strictly to **6 canonical `localStorage` keys**, and operating with a zero-database architecture.

### Key Architecture Documents
- 📘 **[Master System Architecture](docs/architecture.md)**: Full system topology, component responsibilities, folder structure, event communication bus, storage architecture, privacy guarantees, and fallback mode.
- 📜 **[API & Schema Contracts](docs/api_contract.md)**: JSON Schema / TypeScript / Pydantic specifications for the 6 shared objects, Client EventBus contract, and optional stateless FastAPI endpoints.
- ✅ **[9-Developer Integration Checklist](docs/integration_checklist.md)**: Individual parallel sprint assignments, target files, acceptance criteria, and ground rules for the other 9 team members.

---

## 🗺️ The 7 Product Areas

1. **Home (`/`)**: Daily health overview, triage hub, quick actions, active red flag alerts, and empty-state simulation.
2. **Talk or Type (`/talk`)**: Multilingual voice/text input across 5 languages (English, हिन्दी, ಕನ್ನಡ, தமிழ், മലയാളം) with deterministic symptom extraction.
3. **My Health Tracker (`/tracker`)**: Cycle calendar, flow levels, pain ratings (0-10), symptom correlation, and vitals logging.
4. **Early Warnings & Insights (`/insights`, `/patterns`)**: Deterministic rules-based pattern detection (e.g. 3 irregular cycles, rapid hirsutism shifts) and urgent red-flag clinical alerts.
5. **Doctor Summary (`/summary`)**: 1-Page clinician pre-consultation report, cycle metrics, symptom frequency table, printable PDF sheet, and clipboard copy.
6. **Learn and Myths (`/learn`)**: Interactive Myth-vs-Fact cards, evidence-based lifestyle guides, and non-diagnostic reassurance.
7. **Privacy Controls (`/privacy`)**: Zero-cloud vault status, AI opt-in toggle, raw JSON backup export/restore, and emergency data eradication.

---

## 📦 Required LocalStorage Keys

All modules communicate with the client-side database through [`src/services/storageService.js`](src/services/storageService.js) using these 6 canonical keys:

| LocalStorage Key | Data Structure | Purpose |
| :--- | :--- | :--- |
| `pcos_saathi_health_entries` | `HealthEntry[]` | Structured logs of symptoms, voice transcripts, and user notes |
| `pcos_saathi_cycle_entries` | `CycleEntry[]` | Menstrual period logs, flow levels, and cycle dates |
| `pcos_saathi_insights` | `Insight[]` | Generated patterns (irregularities, clusters, severities) |
| `pcos_saathi_doctor_summary` | `DoctorSummary` | Most recently compiled 1-page clinician brief |
| `pcos_saathi_preferences` | `Preferences` | Language (`en`, `hi`, `kn`, `ta`, `ml`), theme, reminders |
| `pcos_saathi_ai_consent` | `AiConsent` | Explicit opt-in flags; `telemetryAllowed` is **always false** |

---

## 🧬 Canonical Shared Data Models

Defined and validated in [`src/models/pcosSaathiSchemas.js`](src/models/pcosSaathiSchemas.js):

- **`HealthEntry`**: Structured record of speech/typed symptoms, severity, duration, and notes.
- **`CycleEntry`**: Period start/end dates, cycle length, period duration, flow level, pain score (0-10), and notes.
- **`Insight`**: Deterministic observation (cycle regularity, symptom progression, cluster correlation) with confidence score and evidence references.
- **`DoctorSummary`**: Clinician pre-consultation dossier with symptom frequency matrix, cycle metrics, and doctor questions.
- **`RedFlag`**: Acute clinical warning with emergency directive and `108` helpline trigger.
- **`SafetyResult`**: Content sanitization verifying non-diagnostic posture and zero drug prescriptions.

---

## ⚡ Inter-Component Communication

Components communicate without coupling through [`src/services/eventBus.js`](src/services/eventBus.js):
```javascript
import { emitEvent, useStorageSubscription, EVENTS } from '../services/eventBus.js';
import { StorageService } from '../services/storageService.js';
import { STORAGE_KEYS } from '../models/pcosSaathiSchemas.js';

// In any component:
const healthEntries = useStorageSubscription(
  STORAGE_KEYS.HEALTH_ENTRIES,
  () => StorageService.getHealthEntries()
);
```

---

## 🛡️ Privacy & Safety Guarantees

1. **Zero External Database**: No MongoDB, Firebase, Supabase, or SQLite server code.
2. **Zero Cloud Telemetry**: User symptoms and audio remain 100% on the device hardware.
3. **Strict No-Prescription Rule**: No medication or dosage suggestions are ever generated.
4. **Mandatory Medical Disclaimer**: Prominently displayed across all advisory surfaces.
5. **Instant Data Purge**: Single-click irreversible deletion of all local records.

---

## 🚀 How to Run

### Option 1: Zero-Install Standalone Browser Runner
Open [`demo.html`](demo.html) directly in any modern browser. It bundles React 18, Tailwind CSS, all components, and offline storage simulation with zero build or npm steps.

### Option 2: Vite Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.
