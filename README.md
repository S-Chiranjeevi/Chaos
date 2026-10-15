# LunaHer

LunaHer is a multilingual women's health companion that helps people describe what they notice, keep a simple record of cycle and symptom changes, learn in plain language, and prepare for a conversation with a health professional. It is an informational tool, not a diagnosis or a replacement for professional care.

## The problem we are solving

People may have questions about periods, symptoms, or PCOS but find it hard to explain what they are experiencing, especially when available tools use unfamiliar medical terms or only support one language. Health information can also be difficult to judge, and it can be hard to remember dates and details during a short appointment.

LunaHer brings these tasks together in one place: users can speak or type in a supported language, keep a personal record, review informational patterns, learn with plain-language articles, and prepare a summary to discuss with a clinician. The app avoids presenting its outputs as a diagnosis. A symptom or pattern can sometimes be related to PCOS or another cause; only a qualified health professional can assess an individual's situation.

## Features

- **Home:** A starting point with shortcuts to describe symptoms, track a cycle, review insights, prepare for a visit, learn, and manage privacy.
- **Talk or Type:** Describe symptoms in text or use speech input when the browser and device support it. Choose from English, Hindi, Hinglish, Kannada, Malayalam, Marathi, Tamil, Telugu, and Bengali. Example prompts can help someone get started.
- **Symptom notes:** Review extracted symptom details and save notes locally for later reference. The app includes plain-language prompts and safety-oriented notices.
- **Cycle tracker and forecasts:** Record period and cycle dates, review entries, and view forecast information when the optional forecast service is configured.
- **Early Warnings and Insights:** Review rule-based pattern information based on saved entries, with explanations and suggested discussion points. These are informational prompts, not medical conclusions.
- **LunaHer Pattern Screening:** An optional research-only pattern screening area for selected clinical details and image-based estimates. The feature explains its limits and must not be used to diagnose, make treatment decisions, or replace clinical care.
- **Doctor Summary:** Gather saved symptoms, cycle details, and selected insights into a summary to help prepare for a healthcare visit.
- **Learn and Myths:** Browse explainers, myth checks, and visit-preparation information in approachable language.
- **Privacy controls:** Review local records, configure an optional MongoDB connection, sync supported records, or remove saved data.
- **Accessible responsive layout:** Navigation and content are designed to work on mobile and desktop, with keyboard support and accessible labels.

Feature availability can depend on browser support, backend availability, and optional service configuration.

## Technology stack

### Web application

- **React 18** and **React DOM 18** for the user interface
- **Vite 5** and `@vitejs/plugin-react` for development and production builds
- **Tailwind CSS 3**, project CSS, PostCSS, and Autoprefixer for styling
- **Lucide React** for interface icons
- **canvas-confetti** for optional celebratory effects
- **Browser localStorage** for the default local record store
- **Web Speech API** for speech input where supported by the browser/device

### Backend and API

- **Node.js** built-in HTTP server for the Gemini-backed symptom analysis endpoint
- **Google Gemini API** for optional AI-assisted responses when a server API key is configured
- **FastAPI** and **Uvicorn** for the Python API
- **Pydantic** and **pydantic-settings** for request schemas and configuration
- **MongoDB** through **Motor**, **PyMongo**, and **dnspython** for optional record sync
- **APIVerve Menstrual Cycle API** for optional cycle forecasting
- **scikit-learn** and **XGBoost** for the research-only pattern screening model
- **Pillow** and **openpyxl** for image and spreadsheet data handling in the screening backend
- Serverless API handlers in `api/` for compatible deployments

### Quality and developer tools

- **Node.js native test runner** (`node --test`) for JavaScript tests
- **pytest** and **pytest-asyncio** for Python backend tests
- **Oxlint** for linting
- **Python dotenv**, **httpx**, and **python-multipart** for backend configuration, HTTP requests, and uploads

## Data and service behavior

Records are stored in the browser by default. The app also provides an optional MongoDB connection and sync feature; when a user configures and uses it, selected health entries, cycle entries, and summaries can be sent to that configured backend/database. Symptom analysis, cycle forecasts, and AI-assisted features may send the relevant request to the configured service provider. Speech recognition is provided by the user's browser/device and may have its own platform behavior. Review provider and deployment policies before using real personal health information. Keep API credentials on the server; do not put secrets in frontend environment variables or commit them.

## Run locally

### Requirements

- Node.js 18 or later and npm
- Python 3.10 or later for the FastAPI backend
- MongoDB only if you want to use remote database sync

### Start the web app and Node API

```bash
git clone https://github.com/S-Chiranjeevi/Chaos.git
cd Chaos
npm install
npm run dev
```

The development helper starts Vite and the Node API. Vite listens on `http://localhost:3000`; the Node API uses port `4174` by default. You can also run only the frontend with `npm run dev:web`.

To enable server-side Gemini responses, copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` on the server. The app has local rule-based behavior for supported flows when an optional online service is not available; some features specifically require their configured service.

### Start the Python API

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment, then install and start the API:

```bash
pip install -r requirements.txt
```

Copy `backend/.env.example` to `backend/.env` and set only the optional service values you intend to use. Then run:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Vite proxies `/api` requests to the Python API at `http://localhost:8000` and symptom-analysis requests to the Node API at `http://localhost:4174` during local development.

## Useful commands

Run from the repository root:

```bash
npm run dev       # Start the frontend and Node API
npm run dev:web   # Start only the Vite frontend
npm run dev:api   # Start only the Node API
npm run build     # Create the production frontend build in dist/
npm run preview   # Serve the built app with the Node server
npm test          # Run JavaScript tests
npm run lint      # Run Oxlint
```

Run Python tests from `backend/` with `pytest`.

## Repository guide

```text
src/
  components/   Reusable interface, navigation, tracker, insight, and screening UI
  data/         Language, translation, prompt, and educational content
  models/       Health-entry and insight data models
  pages/        Main application pages
  services/     Local storage, symptom, speech, forecast, screening, and API services
  views/        Shared page-level views, including privacy controls
  App.jsx       Application routes and layout
api/            Serverless API handlers
backend/        FastAPI application, models, services, and Python tests
server/         Node.js API server and Gemini client
docs/           Architecture, API contracts, and integration notes
tests/          JavaScript test coverage
```

## Health information notice

LunaHer provides educational information and tools to organize personal notes. It does not diagnose PCOS or another condition, and it does not provide a treatment plan. Patterns and screening outputs can sometimes be related to a health concern, but they can also have other explanations. Talk with a qualified health professional about personal symptoms or care decisions. If a situation feels urgent, seek local emergency or urgent medical help.

## Contributing

Please keep language understandable, make the next action clear on each screen, preserve keyboard and screen-reader access, and keep health-related wording informational and non-diagnostic. Never commit API keys, database credentials, or personal health records.
