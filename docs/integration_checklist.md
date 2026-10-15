# PCOS Saathi — 9-Developer Integration Checklist & Sprint Board

> **Lead Architect Notice:** All 9 developers can work simultaneously in parallel branches without file collision by adhering strictly to these contracts, component boundaries, and storage keys.

---

## 📋 Master Architectural Ground Rules for All Developers

1. **NO External Databases**: Do NOT introduce MongoDB, Firebase, Supabase, or SQLite server code. All data lives in `localStorage` via [`src/services/storageService.js`](file:///c:/Users/spurv/OneDrive/Documents/choas/src/services/storageService.js).
2. **NO Ad-hoc LocalStorage Keys**: Only use the 6 canonical keys defined in `STORAGE_KEYS`.
3. **NO Direct Prescriptions / Diagnoses**: All health copy must be non-diagnostic and display `MEDICAL_DISCLAIMER`.
4. **NO Icon-Only Buttons**: Every interactive button must have visible descriptive text and helper text per accessibility standards.
5. **Use the EventBus**: Communicate between product areas using `emitEvent()` and `useStorageSubscription()` from [`src/services/eventBus.js`](file:///c:/Users/spurv/OneDrive/Documents/choas/src/services/eventBus.js).

---

## 👩‍💻 Developer 1: Home Dashboard & Triage Hub

**Product Area:** Home (`/`)  
**Target Files:** `src/views/HomeView.jsx`, `src/components/home/*`

### Responsibilities:
- [ ] Connect daily greeting to current patient profile from `StorageService.getPreferences()`.
- [ ] Render **Quick Health Actions** (Talk/Type, Log Cycle, Doctor Summary, Guides) using `src/components/common/Card.jsx`.
- [ ] Display **Latest Cycle Status Pill** (Days since last period from `StorageService.getCycleEntries()`).
- [ ] Render **Active Red Flag Alert Banner** if `StorageService.getInsights()` contains red flags, with instant trigger for `UrgentWarning`.
- [ ] Provide empty-state toggle so hackathon judges can preview both empty and filled states.

### Acceptance Criteria:
- When a new HealthEntry or CycleEntry is logged in another tab/view, Home automatically updates via `useStorageSubscription()`.
- Emergency Helpline 108 button is prominently reachable within 1 click.

---

## 👩‍💻 Developer 2: Talk or Type Multilingual Companion

**Product Area:** Talk or Type (`/talk`)  
**Target Files:** `src/views/TalkView.jsx`, `src/components/TalkOrType.jsx`, `src/services/speechService.js`

### Responsibilities:
- [ ] Support voice recording and typed input across 5 languages: English, हिन्दी, ಕನ್ನಡ, தமிழ், മലയാളം.
- [ ] Use `speechService.js` for Web Speech API with fallback message for unsupported browsers.
- [ ] Feed transcribed audio or typed text through `symptomExtractor.js`.
- [ ] Display extracted symptoms in editable `SymptomCards.jsx` allowing users to adjust severity (`Mild`, `Moderate`, `Severe`) or delete mistaken tags.
- [ ] Commit finalized entry via `StorageService.saveHealthEntry()` (which automatically fires `pcos_saathi:data_change`).

### Acceptance Criteria:
- Entries are saved to `pcos_saathi_health_entries`.
- Microphone denial displays accessible permission-guidance banner with clear switch to typing.

---

## 👩‍💻 Developer 3: My Health Tracker & Cycle Engine

**Product Area:** My Health Tracker (`/tracker`)  
**Target Files:** `src/views/TrackerView.jsx`, `src/components/CycleTracker.jsx`, `src/components/tracker/*`

### Responsibilities:
- [ ] Upgrade cycle logging form to save `CycleEntry` objects: `startDate`, `endDate`, `flowLevel`, `painScore` (0-10 slider), and `associatedSymptoms`.
- [ ] Save to `StorageService.saveCycleEntry()` (`pcos_saathi_cycle_entries`).
- [ ] Display visual timeline history of past cycles sorted newest first.
- [ ] Show category filter tabs: *All Records, Symptoms, Cycle, Vitals, Mood, Notes*.
- [ ] Compute and display basic metrics: average cycle length in days, period duration, and variability note.

### Acceptance Criteria:
- Entering a period start date calculates cycle length if a previous cycle exists.
- Fully compatible with `pcos_saathi_cycle_entries`.

---

## 👩‍💻 Developer 4: Early Warnings & Pattern Detection UI

**Product Area:** Early Warnings & Insights (`/insights`)  
**Target Files:** `src/views/InsightsView.jsx`, `src/components/PatternDetectionView.jsx`, `src/services/patternDetectionService.js`

### Responsibilities:
- [ ] Read `StorageService.getCycleEntries()` and `StorageService.getHealthEntries()`.
- [ ] Pass them to `analyzeHealthPatterns()` from `patternDetectionService.js`.
- [ ] Save detected patterns to `pcos_saathi_insights` via `StorageService.saveInsights()`.
- [ ] Render high-contrast red flag warnings with emergency action prompt (`108` helpline) for acute combinations (e.g. fever + severe pelvic pain, or bleeding with fainting).
- [ ] Provide preset buttons (*"1. Three Irregular Cycles"*, *"2. Rapid Weight Gain & Acne"*, *"3. Severe Pelvic Pain"*) so hackathon judges can simulate scenarios instantly.

### Acceptance Criteria:
- Rule engine executes deterministically in JavaScript with 0 network calls.
- Emits `pcos_saathi:red_flag_triggered` event if acute clinical criteria are met.

---

## 👩‍💻 Developer 5: Doctor Summary & Clinician Brief

**Product Area:** Doctor Summary (`/summary`)  
**Target Files:** `src/views/SummaryView.jsx`, `src/components/HealthEntryExport.jsx`, `src/components/summary/*`

### Responsibilities:
- [ ] Aggregate data from `StorageService.getCycleEntries()` and `StorageService.getHealthEntries()`.
- [ ] Compile a standardized `DoctorSummary` object saved to `pcos_saathi_doctor_summary`.
- [ ] Display formatted 1-Page Pre-Consultation Sheet:
  1. Patient Demographic context & preferred language.
  2. Cycle regularity stats (Average, longest, shortest cycle).
  3. Frequency table of top reported symptoms over the last 30/90 days.
  4. Suggested checklist of clinical questions for the gynecologist.
- [ ] Implement **Print / Save PDF** action via `window.print()` with clean print-specific CSS.
- [ ] Implement **Copy Text Brief** action for easy WhatsApp or messaging share with family or clinician.

### Acceptance Criteria:
- Printable view hides navigation sidebars/headers and renders high-contrast, black-and-white legible typography.

---

## 👩‍💻 Developer 6: Learn & Myths Knowledge Center

**Product Area:** Learn & Myths (`/learn`)  
**Target Files:** `src/views/LearnView.jsx`, `src/data/pcosMyths.js`, `src/components/learn/*`

### Responsibilities:
- [ ] Create interactive **Myth vs Fact** flip cards addressing common cultural misconceptions:
  - *Myth:* "PCOS means you can never get pregnant." -> *Fact:* Explains ovulation induction and lifestyle support.
  - *Myth:* "Only overweight women get PCOS." -> *Fact:* Explains lean PCOS phenotype.
  - *Myth:* "Birth control pills are the only cure." -> *Fact:* Clarifies symptomatic management vs root lifestyle care.
- [ ] Add category filter chips: *All, Myths vs Facts, Nutrition & Inositol, Exercise & Stress, When to See a Doctor*.
- [ ] Provide search bar filtering articles by keyword.
- [ ] Include in-app modal reader for deep dives.

### Acceptance Criteria:
- Strictly compliant with `MEDICAL_DISCLAIMER` on every article.
- Zero medication prescriptions or dosage suggestions.

---

## 👩‍💻 Developer 7: Privacy Controls, Data Vault & Emergency Purge

**Product Area:** Privacy Controls (`/privacy`)  
**Target Files:** `src/views/PrivacyView.jsx`, `src/components/PrivacyControls.jsx`, `src/components/privacy/*`

### Responsibilities:
- [ ] Display **Local Storage Vault Status** card showing exact counts of stored entries and bytes used.
- [ ] Render **AI Opt-In & Privacy Consent** toggle (`pcos_saathi_ai_consent`).
  - Clearly state that remote telemetry is strictly disallowed.
  - Inform users that voice recognition runs locally on their device.
- [ ] Implement **Export All My Data (JSON)** downloading a clean `.json` backup file.
- [ ] Implement **Restore Data from JSON** allowing users to restore from a backup file.
- [ ] Implement **Emergency "Delete All My Data"** action:
  - Prompts with accessible confirmation dialog.
  - Calls `StorageService.clearAllPcosData()`.
  - Dispatches `pcos_saathi:data_purged` and routes user to `/` with fresh empty state.

### Acceptance Criteria:
- Clicking "Delete All My Data" empties all `pcos_saathi_*` and legacy keys immediately without leaving orphaned records.

---

## 👩‍💻 Developer 8: Design System Atoms & Accessibility (WCAG AAA)

**Cross-Cutting Area:** Design System & Accessibility  
**Target Files:** `src/components/common/*`, `src/components/layout/*`, `src/index.css`

### Responsibilities:
- [ ] Audit all 7 views for **visible helper text**: ensure NO action button is icon-only.
- [ ] Verify color contrast ratios: text must meet WCAG AAA standards against backgrounds (deep stone/rose/emerald).
- [ ] Implement keyboard navigation (`tabIndex`, `onKeyDown` for Enter and Space on interactive cards).
- [ ] Ensure mobile touch targets are at least `48px x 48px` on `MobileNav` and all form inputs.
- [ ] Verify `role="alert"`, `aria-live="assertive"` on `GlobalError` and `UrgentWarning`.
- [ ] Polish responsive typography with `Plus Jakarta Sans` across 390px, 768px, and 1280px viewports.

### Acceptance Criteria:
- Lighthouse accessibility score ≥ 95.
- Complete screen reader compatibility (`sr-only` descriptive status tags).

---

## 👩‍💻 Developer 9: Offline Test Harness, Fallback Verification & Mock Data

**Cross-Cutting Area:** Testing, Reliability & Fallback Verification  
**Target Files:** `src/mockData/pcosSeedData.js`, `demo.html`, test suites

### Responsibilities:
- [ ] Create realistic pre-packaged seed scenarios in `pcosSeedData.js`:
  1. *Scenario A: Oligomenorrhea & Acne (3 cycles of 58, 62, 70 days)*
  2. *Scenario B: Severe Dysmenorrhea & Red Flag Pelvic Pain*
  3. *Scenario C: Fresh User (Zero records)*
- [ ] Add a floating "🧪 Judge Demo Bar" on the top of `demo.html` to load any seed scenario in 1 click.
- [ ] Test offline behavior by disabling network in devtools and confirming all 7 views function seamlessly.
- [ ] Update `demo.html` with the latest bundled components for zero-install presentation.

### Acceptance Criteria:
- Clicking a scenario in the demo bar instantly seeds localStorage and refreshes all components reactively without page reload.
- Full verification that the app works with 0 active internet connection.

---

## 🚀 Integration Verification Commands

```bash
# 1. Pull latest master
git pull origin main

# 2. Start Vite local server
npm run dev

# 3. Open standalone zero-dependency runner
# Double-click demo.html in any browser
```
