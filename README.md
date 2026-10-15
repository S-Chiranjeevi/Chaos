# Luna Her

Luna Her is an educational symptom-understanding website. It summarizes symptom patterns in plain language and helps people prepare questions for a healthcare professional. It does not diagnose conditions or recommend medicines or dosages.

## Run locally

Install dependencies with `npm install`, copy `.env.example` to `.env.local`, add your Gemini key to `GEMINI_API_KEY`, then run `npm run dev`. The local API starts on port 4174 and Vite proxies `/api` requests to it.

For a production-style local run, use `npm run build` and then `npm start`. The Node server serves the built site and the Gemini endpoint from the same origin. Set `GEMINI_API_KEY` in the server environment for deployment. Never put the key in a `VITE_*` variable or client-side source: Gemini requests go through `/api/analyze-symptoms`, and the key is read only by the server.

The talk or type assistant supports general health questions and symptom descriptions in English, Hindi, Kannada, Tamil, Malayalam, Telugu, and automatic language detection for typed input. Voice input uses the browser Speech Recognition API where available. If Gemini is unavailable or has not been configured, Luna Her falls back to its local rules and clearly labels that result as limited. Messages are sent to Google Gemini when the API is configured; symptom entries are stored locally in the browser. Vercel deployments use the serverless handlers in `api/` and need `GEMINI_API_KEY` set in the project environment.

## Rules engine and examples

Run `npm test` to check the rules engine. The five requested examples are defined in `src/engine.js` and verified in `src/engine.test.js`. Basic English, Hindi, and Telugu keyword patterns are included as a starting point; they are not a substitute for clinical review or professional translation.
