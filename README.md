# SakhiCare Frontend Shell (Hackathon Edition)

A responsive, accessible, privacy-first frontend shell built for **SakhiCare** using **React** and **Tailwind CSS**. Designed specifically for a 5-hour hackathon timeframe, providing a clean architecture that can be extended with offline speech recognition, symptom triage models, and encrypted device databases.

---

## 🌟 Key Architecture & Features

### 1. Responsive Shell Layout
- **Mobile (< 768px)**: Optimized single-column layout with fixed bottom navigation bar (`MobileNav`) adhering to mobile touch targets (min 48px), safe-area insets, and compact sticky top header.
- **Tablet (768px – 1024px)**: Fluid responsive grid cards with balanced touch-first navigation.
- **Desktop (≥ 1024px)**: Fixed left navigation sidebar (`Sidebar`) with expanded titles, visible helper text, active indicators, device vault status, and emergency helpline quick triggers.

### 2. Top Header (`Header.jsx`)
- **SakhiCare Logo**: Warm maternal embrace emblem with brand name and bilingual badge (*सखी*).
- **Current Language Selector**: Displays active language (e.g., *English*, *हिन्दी*, *বাংলা*, *தமிழ்*, *తెలుగు*, *मराठी*) with visible click action triggering the `LanguageSelector` dialog.
- **Privacy Indicator**: High-visibility badge with a green status indicator: **“Stored only on this device”** with tooltip/subtext reassuring users that zero health data is sent to external servers.
- **Error Simulation Trigger**: Header button to immediately preview the `GlobalError` area.

### 3. Mobile Bottom Navigation (`MobileNav.jsx`)
Features all 5 core routes with visible labels and helper text:
1. **Home (`/`)**: Daily overview & quick action hub
2. **Talk or Type (`/talk`)**: Dual-mode voice & text health companion
3. **Tracker (`/tracker`)**: Symptom, cycle, and vital logs
4. **Summary (`/summary`)**: Clinician-ready 1-page pre-consultation brief
5. **Learn (`/learn`)**: Curated maternal guides & wellness library

### 4. Desktop Sidebar Navigation (`Sidebar.jsx`)
- Full navigation items with visible labels and clear secondary helper text for cognitive accessibility.
- Local-First Vault indicator.
- Priority Emergency Assistance card with direct trigger for National Ambulance / Maternal Helpline (`108` / `102`).

### 5. Shared Component Library (`src/components/common/`)
- [Button.jsx](file:///c:/Users/spurv/OneDrive/Documents/choas/src/components/common/Button.jsx): Accessible button with variants (`primary`, `secondary`, `outline`, `danger`, `ghost`, `warm`), loading spinner states, and visible helper text.
- [Card.jsx](file:///c:/Users/spurv/OneDrive/Documents/choas/src/components/common/Card.jsx): Elevated semantic containers with header, subtitle, actions, and footer slots.
- [Badge.jsx](file:///c:/Users/spurv/OneDrive/Documents/choas/src/components/common/Badge.jsx): Color-coded badges with optional status dots and screen-reader accessibility labels.
- [DisclaimerBanner.jsx](file:///c:/Users/spurv/OneDrive/Documents/choas/src/components/common/DisclaimerBanner.jsx): Prominent medical safety disclaimer and on-device privacy guarantee with an expandable details drawer.
- [UrgentWarning.jsx](file:///c:/Users/spurv/OneDrive/Documents/choas/src/components/common/UrgentWarning.jsx): High-contrast red-flag clinical warning with one-touch emergency call trigger (`108`) and ASHA escort contact.
- [LanguageSelector.jsx](file:///c:/Users/spurv/OneDrive/Documents/choas/src/components/common/LanguageSelector.jsx): Accessible modal dialog supporting major Indian languages with native scripts and regional speech indicators.
- [LoadingState.jsx](file:///c:/Users/spurv/OneDrive/Documents/choas/src/components/common/LoadingState.jsx): Accessible ARIA live status with spinner and animated skeleton card variants.
- [EmptyState.jsx](file:///c:/Users/spurv/OneDrive/Documents/choas/src/components/common/EmptyState.jsx): Friendly, non-intimidating empty state with actionable CTAs and visible helper hints.

### 6. Reusable Page Header (`PageHeader.jsx`)
- Main `<h1>` heading, description, category/stage badge.
- Fully labeled back button with visible text (*"Back to Home Dashboard"*) and helper text (*"Returns to main overview"*).

### 7. Global Error Area (`GlobalError.jsx`)
- Accessible notification banner (`role="alert"`, `aria-live="assertive"`).
- Displays error code, explanation, retry button with helper text, and dismiss action.

---

## 📁 Shared `HealthEntry` Data Format

The mock data in [healthEntries.js](file:///c:/Users/spurv/OneDrive/Documents/choas/src/mockData/healthEntries.js) conforms to the standard specification in [health.js](file:///c:/Users/spurv/OneDrive/Documents/choas/src/types/health.js):

```javascript
{
  id: "entry-001",
  timestamp: "2026-10-15T08:15:00Z",
  dateFormatted: "Today, 8:15 AM",
  category: "vital", // "symptom" | "cycle" | "vital" | "mood" | "note"
  title: "Morning Fetal Kick Count & BP",
  severity: "mild", // "mild" | "moderate" | "severe"
  stage: "2nd Trimester · Week 24",
  tags: ["Kick Count", "Blood Pressure", "Routine"],
  notes: "Counted 10 distinct movements within 35 minutes after warm breakfast.",
  vitals: {
    bpSystolic: 118,
    bpDiastolic: 76,
    pulse: 74,
    fetalKicksCount: 10
  },
  isUrgent: false,
  source: "quick-log" // "voice" | "typed" | "quick-log"
}
```

---

## 🚀 How to Run

### Option 1: Instant Standalone Browser Launch (Zero Installation Required)
Simply open [demo.html](file:///c:/Users/spurv/OneDrive/Documents/choas/demo.html) directly in any modern web browser (Edge, Chrome, Firefox, Safari). It bundles the full React 18 and Tailwind CSS application via CDN with zero build steps or npm installations needed!

### Option 2: Vite Development Server
When running with Node.js installed:
```bash
npm install
npm run dev
```
Then navigate to `http://localhost:3000`.
