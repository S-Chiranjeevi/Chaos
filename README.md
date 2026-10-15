# SakhiCare

SakhiCare is an educational symptom-understanding website. It summarizes symptom patterns in plain language and helps people prepare questions for a healthcare professional. It does not diagnose conditions or recommend medicines or dosages.

## Run locally

Install dependencies with `npm install`, then start the development server with `npm run dev`.

## Rules engine and examples

Run `npm test` to check the rules engine. The five requested examples are defined in `src/engine.js` and verified in `src/engine.test.js`. Basic English, Hindi, and Telugu keyword patterns are included as a starting point; they are not a substitute for clinical review or professional translation.
