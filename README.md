# SakhiCare (सखी केयर) ✿
### Multilingual PCOS Symptom Understanding & Clinical Care Navigator

> **Hackathon Theme:** Build a tool that turns everyday descriptions of symptoms—including regional-language inputs—into understandable information and guidance toward appropriate care, particularly for PCOS. It should not present itself as diagnosing.

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-15%20Passing-success)](https://nodejs.org/api/test.html)
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
- Educational grounding under the **Rotterdam 2003 International Consensus**.
- Safe clinical triage (Routine Consultation vs. Urgent Red Flags).
- Clear care navigation (which specialist to consult: Gynecologist, Endocrinologist, Dermatologist, Dietitian).
- An exportable **Doctor Consultation Briefing** with pre-formulated doctor questions.

> ⚠️ **Strict Non-Diagnostic Medical Guardrail:** SakhiCare **never** claims to diagnose conditions or recommend pharmaceutical dosages. Every output reinforces: *"These symptoms can sometimes occur with PCOS, but they can also have other causes. Only in-person blood panels and pelvic imaging evaluated by a certified physician can provide a definitive diagnosis."*

---

## ✨ Key Features

### 1. 🎙️ "Talk or Type" Multilingual Input
- **Speech-to-Text & Typed Input:** Uses the Web Speech API and responsive text entry.
- **9 Languages & Dialects Supported:**
  - **English**
  - **Hindi (हिंदी)**
  - **Hinglish (Colloquial Hindi-English)**
  - **Telugu (తెలుగు)**
  - **Tamil (தமிழ்)**
  - **Kannada (ಕನ್ನಡ)**
  - **Malayalam (മലയാളം)**
  - **Marathi (मराठी)**
  - **Bengali (বাংলা)**
- **One-Click Vernacular Chips:** Realistic presets for common expressions (e.g., missed cycles, facial hair, dark neck, painful cramps).

### 2. 🩻 Interactive Anatomical Body Explorer
- Visual SVG silhouette with pulsing interactive hotspots:
  - **Crown / Scalp:** Hair shedding, diffuse part thinning (androgenic alopecia pathway).
  - **Jawline & Face:** Hormonal cystic acne and hirsutism.
  - **Neck & Skin Folds:** Acanthosis Nigricans (cutaneous marker of hyperinsulinemia).
  - **Abdomen:** Central visceral adiposity and intense glycemic sugar cravings.
  - **Pelvis:** Oligomenorrhea, irregular ovulation, and ovarian morphology.
- Connects colloquial phrases to clinical terminology and specific doctor inquiries.

### 3. 🔬 Rotterdam 2003 Diagnostic Consensus Matrix
- Educates users on the 3 international clinical pillars:
  1. **Ovulatory Dysfunction** (oligo/anovulation, cycles >35 days).
  2. **Hyperandrogenism** (clinical hirsutism/acne or elevated biochemical testosterone/DHEA-S).
  3. **Polycystic Ovarian Morphology** (≥20 follicles per ovary or volume >10 mL on pelvic ultrasound).
- Explicitly explains why at least 2 of 3 pillars + exclusion of mimics (thyroid, prolactin) are required, and why digital tools cannot diagnose.

### 4. 🚨 Safe Clinical Triage & Red-Flag Detection
- Automatically identifies acute medical emergencies:
  - Severe sudden pelvic pain (potential ovarian torsion or ruptured cyst).
  - Heavy soaking bleeding accompanied by dizziness/fainting (hemorrhagic risk).
- Provides immediate, high-priority **Urgent Medical Attention** notices with emergency contact prompts.

### 5. 🩺 Specialist Care Navigator
- Guides users to the most appropriate healthcare professional based on their symptoms:
  - **Gynecologist (OB-GYN):** First point of contact for cycle irregularity and pelvic ultrasounds.
  - **Endocrinologist:** For insulin resistance, Acanthosis Nigricans, and metabolic management.
  - **Dermatologist:** For cystic acne vulgaris and medical management of hirsutism.
  - **Clinical Dietitian:** For evidence-based low-glycemic, anti-inflammatory lifestyle nutrition.

### 6. 📝 Doctor Visit Preparation Kit
- Generates a clinical consultation summary:
  - Primary symptom summary and timeline.
  - Key questions to ask during the consultation.
  - Recommended laboratory and imaging tests (Pelvic USG, Fasting Insulin, HOMA-IR, Total/Free Testosterone, TSH, HbA1c, DHEA-S).
  - One-click copy or print for physical consultation visits.

### 7. 🗓️ Private Cycle & Symptom Tracker
- Log cycles, symptom severity, and mood patterns over time.
- **100% Client-Side Privacy:** Stored exclusively in local `localStorage`; zero cloud transmission, no account tracking, and one-click data purge.

### 8. 💡 Evidence-Based Myth Busters
- Disarms harmful stigmas:
  - *Myth:* PCOS means you can never get pregnant. → *Fact:* PCOS is one of the most treatable ovulatory conditions.
  - *Myth:* PCOS only affects people who are overweight. → *Fact:* Up to 30% have "Lean PCOS" with normal BMI.
  - *Myth:* Birth control pills cure PCOS. → *Fact:* Pills manage symptoms; they do not alter underlying biology.
  - *Myth:* Follicles on ultrasound always mean PCOS. → *Fact:* Up to 25% of healthy women have multifollicular ovaries without PCOS.

---

## 🛠️ Technology Architecture

- **Frontend:** React 19 + Vite 8
- **Styling:** Custom Vanilla CSS Design System with light/dark wellness themes, glassmorphism, responsive grids, and micro-interactions.
- **Icons:** Lucide React
- **Voice Recognition:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)
- **Testing:** Node.js native test runner (`node --test`) covering 15 unit and integration test suites.

```
src/
├── components/
│   ├── BodyExplorer.jsx        # Interactive SVG anatomical hotspot mapper
│   ├── CycleTracker.jsx        # Private client-side cycle and symptom diary
│   ├── EducationLibrary.jsx    # Evidence-grounded women's health library
│   ├── MythBusters.jsx         # Myth vs. fact cards
│   ├── PrivacyControls.jsx     # Local storage deletion and privacy audit
│   ├── RotterdamMatrix.jsx     # 3-Pillar Rotterdam consensus educational component
│   ├── SpecialistNavigator.jsx # Clinical provider navigation guide
│   └── TalkOrType.jsx          # Voice/text symptom input, extraction & doctor prep
├── data/
│   ├── languages.js            # Dictionaries & prompts (EN, HI, Hinglish, TE, TA, KN, ML, MR, BN)
│   └── pcosKnowledge.js        # Differential guidance, questions, recommended labs
├── models/
│   └── healthEntry.js          # Standardized health data schemas and persistence
├── services/
│   └── symptomExtractor.js     # Multilingual rule-based extractor & Rotterdam pillar mapper
├── engine.js                   # Core rules engine and clinical triage
├── engine.test.js              # 15 automated test cases
├── App.jsx                     # Root application container & navigation
├── App.css                     # Comprehensive design system tokens and responsive styles
└── main.jsx                    # Vite app entrypoint
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
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
Open your browser at `http://localhost:5173` to explore SakhiCare locally.

### Running Automated Tests
```bash
npm test
```
Runs the 15 automated test cases verifying symptom extraction across languages (English, Hindi, Hinglish, Tamil, Telugu), red flag triage, and Rotterdam mappings.

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
