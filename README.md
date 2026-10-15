# SakhiCare (सखी केयर / PCOS Saathi) ✿
### Multilingual PCOS & Women's Health Symptom Care Navigator

> **Hackathon Theme:** Build a tool that turns everyday descriptions of symptoms—including regional-language inputs—into understandable information and guidance toward appropriate care, particularly for PCOS. It should not present itself as diagnosing.
>
> **Architecture & Contracts:** [docs/architecture.md](docs/architecture.md) · [docs/api_contract.md](docs/api_contract.md) · [docs/integration_checklist.md](docs/integration_checklist.md)  
> **Core Invariant:** Zero remote database (No MongoDB, PostgreSQL, Firebase). 100% offline-first local persistence via `localStorage`/`IndexedDB`.

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-36%20Passing-success)](https://nodejs.org/api/test.html)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-green)](https://github.com/S-Chiranjeevi/Chaos)
[![Medical Disclaimer](https://img.shields.io/badge/Medical%20Framing-Non--Diagnostic-important)](https://github.com/S-Chiranjeevi/Chaos)

---

## 🎯 The Problem

Polycystic Ovary Syndrome (PCOS) affects **1 in 5 women** of reproductive age in India, yet up to **70% remain undiagnosed or face a 2+ year delay** before receiving appropriate clinical guidance. 

Major systemic barriers include:
1. **Vernacular & Everyday Language Gap:** Women describe symptoms using colloquial, emotional, or regional phrasing (*"periods 2-3 mahine late aate hain"*, *"chin par unwanted baal"*, *"gale par kaalapan"*, *"மாதவிடாய் தள்ளிப்போகிறது"*), which generic symptom checkers fail to comprehend.
2. **Medical Jargon & Stigma:** Fear of infertility stigma or dismissal prevents early care-seeking.
3. **Misleading AI "Diagnoses":** Online symptom searchers often give false certainty or alarmist diagnoses without clinical backing.
4. **Unprepared Clinical Consultations:** Patients arrive at 10-minute doctor visits without structured symptom timelines, missing out on crucial diagnostic tests.

---

## 💡 The Solution: SakhiCare

**SakhiCare** bridges the gap between everyday lived experiences and evidence-based clinical medicine. It empowers women to express how they feel naturally—through **voice or text in 9 regional languages and dialects**—and transforms those narratives into:
- Structured health symptom cards (duration, frequency, severity).
- Early Warning & Pattern Detection rules engine with evidence cards.
- Educational grounding under the **Rotterdam 2003 International Consensus**.
- Safe clinical triage (Routine Consultation vs. Urgent Red Flags).
- Clear care navigation (which specialist to consult: Gynecologist, Endocrinologist, Dermatologist, Dietitian).
- An exportable **Doctor Consultation Briefing** with pre-formulated doctor questions.

> ⚠️ **Strict Non-Diagnostic Medical Guardrail:** SakhiCare **never** claims to diagnose conditions or recommend pharmaceutical dosages. Every output reinforces: *"These symptoms can sometimes occur with PCOS, but they can also have other causes. Only in-person blood panels and pelvic imaging evaluated by a certified physician can provide a definitive diagnosis."*

---

## 🌟 Key Architecture & Features

### 1. 🎙️ "Talk or Type" Multilingual Input (`/talk`)
- **Speech-to-Text & Typed Input:** Uses the Web Speech API and responsive text entry.
- **9 Languages & Dialects Supported:**
  - English, Hindi (हिंदी), Hinglish, Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Bengali (বাংলা).
- **One-Click Vernacular Chips:** Realistic presets for common expressions (e.g., missed cycles, facial hair, dark neck, painful cramps).

### 2. ⚠️ Early Warning & Repeated Pattern Detection (`/patterns`)
- **Rules-Based, Deterministic Engine:** Operates 100% locally on device without black-box AI hallucinations (`src/services/earlyWarning.js`).
- **Analyzes Repeated Symptoms & Worsening Trends:**
  - Repeated irregular cycles & long gaps (>35 days)
  - Repeated pelvic discomfort
  - Repeated acne breakouts across consecutive cycles
  - Repeated hair changes (facial hirsutism, scalp shedding)
  - Increasing pain severity (mild → moderate → severe)
  - Increasing bleeding volume
  - Multiple concurrent symptoms (metabolic, ovulatory, androgenic)
  - Insufficient tracking data explanations
- **Structured Warning Cards (`EarlyWarningCard.jsx` & `PatternExplanation.jsx`):**
  - Distinct urgency levels (Urgent: Red, Soon: Amber, Informational: Blue/Green)
  - Full transparent evidence breakdown
  - Plain-language explanation ("Why am I seeing this?")
  - Actionable next steps and one-click add to Doctor Summary Basket
  - Non-urgent warning dismissal

### 3. 🩻 Interactive Anatomical Body Explorer
- Visual SVG silhouette with pulsing interactive hotspots:
  - **Crown / Scalp:** Hair shedding, diffuse part thinning (androgenic alopecia pathway).
  - **Jawline & Face:** Hormonal cystic acne and hirsutism.
  - **Neck & Skin Folds:** Acanthosis Nigricans (cutaneous marker of hyperinsulinemia).
  - **Abdomen:** Central visceral adiposity and intense glycemic sugar cravings.
  - **Pelvis:** Oligomenorrhea, irregular ovulation, and ovarian morphology.

### 4. 🔬 Rotterdam 2003 Diagnostic Consensus Matrix
- Educates users on the 3 international clinical pillars:
  1. **Ovulatory Dysfunction** (oligo/anovulation, cycles >35 days).
  2. **Hyperandrogenism** (clinical hirsutism/acne or elevated biochemical testosterone/DHEA-S).
  3. **Polycystic Ovarian Morphology** (≥20 follicles per ovary or volume >10 mL on pelvic ultrasound).
- Explicitly explains why at least 2 of 3 pillars + exclusion of mimics (thyroid, prolactin) are required, and why digital tools cannot diagnose.

### 5. 🚨 Safe Clinical Triage & Red-Flag Detection
- Automatically identifies acute medical emergencies:
  - Severe sudden pelvic pain (potential ovarian torsion or ruptured cyst).
  - Heavy soaking bleeding accompanied by dizziness/fainting (hemorrhagic risk).
- Provides immediate, high-priority **Urgent Medical Attention** notices with emergency contact prompts.

### 6. 🩺 Specialist Care Navigator
- Guides users to the most appropriate healthcare professional:
  - **Gynecologist (OB-GYN):** Cycle irregularity and pelvic ultrasounds.
  - **Endocrinologist:** Insulin resistance, Acanthosis Nigricans, and metabolic management.
  - **Dermatologist:** Cystic acne vulgaris and medical management of hirsutism.
  - **Clinical Dietitian:** Evidence-based low-glycemic, anti-inflammatory lifestyle nutrition.

### 7. 🗓️ Private Cycle & Symptom Tracker (`/tracker`)
- Log cycles, symptom severity, and mood patterns over time.
- **100% Client-Side Privacy:** Stored exclusively in browser local storage; zero cloud transmission.

### 8. 💡 Evidence-Based Myth Busters
- Disarms widespread stigmas regarding fertility, lean PCOS, birth control pills, and ultrasound follicles.

---

## 🛠️ Technology Architecture

- **Frontend:** React 19 + Vite 8 + Tailwind CSS 3
- **Icons:** Lucide React
- **Voice Recognition:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)
- **Testing:** Node.js native test runner (`node --test`) covering 36 automated test cases.

```
src/
├── components/
│   ├── BodyExplorer.jsx          # Interactive SVG anatomical hotspot mapper
│   ├── EarlyWarningCard.jsx      # Warning card with evidence, why seeing this, dismiss
│   ├── PatternExplanation.jsx    # Evidence breakdown & educational pattern explanations
│   ├── PatternDetectionView.jsx  # Interactive early warning & pattern detection hub
│   ├── RotterdamMatrix.jsx       # 3-Pillar Rotterdam consensus educational component
│   ├── SpecialistNavigator.jsx   # Clinical provider navigation guide
│   ├── MythBusters.jsx           # Myth vs. fact cards
│   ├── common/                   # Reusable UI component library (Button, Card, Badge, etc.)
│   └── layout/                   # Shell layout (Header, Sidebar, MobileNav, GlobalError)
├── services/
│   ├── earlyWarning.js           # Early warning rules engine & pattern detection
│   ├── patternDetectionService.js# Pattern analysis service
│   └── symptomExtractor.js       # Multilingual rule-based extractor & Rotterdam pillar mapper
├── views/                        # Route views (Home, Talk, Tracker, Summary, Learn, Privacy)
├── data/                         # Languages dictionaries and presets
├── engine.js                     # Core rules engine and clinical triage
└── App.jsx                       # Responsive app router
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/S-Chiranjeevi/Chaos.git
cd Chaos

# Install dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` (or `http://localhost:3000`) to explore SakhiCare locally.

### Running Automated Tests
```bash
npm test
```
Runs 36 automated test cases verifying symptom extraction, red flag triage, and early warning pattern detection across languages.

### Building for Production
```bash
npm run build
```

---

## 📜 Medical Ethics & Safety Statement

SakhiCare adheres strictly to digital health communication standards:
- **No Diagnostic Claims:** SakhiCare provides educational insights, differential possibilities, and preparation materials. It does not replace clinical consultation.
- **Differential Awareness:** Emphasizes that symptoms like irregular periods or fatigue can stem from thyroid conditions, stress, hyperprolactinemia, or nutritional deficiencies.
- **Red Flag Escalation:** Immediately directs individuals experiencing acute pain or severe bleeding to emergency medical facilities.
- **Data Sovereignty:** All personal data entered into SakhiCare remains strictly in the user's browser local memory.

---

## 👥 Authors & Acknowledgments

- **Built with empathy for women's reproductive health self-advocacy.**
- Open source under the MIT License.
