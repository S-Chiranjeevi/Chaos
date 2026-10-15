# Luna Her — product and UX handoff

## Product promise

Luna Her helps women put what they notice into their own words, keep optional health notes, and prepare for a conversation with a health worker. It offers general information, not diagnosis or treatment. People can skip tracking and decide what to share.

## Screen map

```text
Home
├── Talk or type → Review your notes → Save my note
├── Health tracker → Log a period date → Saved dates
├── Doctor summary → Create draft → Review before sharing
└── Learn → Myth or fact article → Save article
```

Persistent navigation: **Home**, **Talk or type**, **Health tracker**, **Doctor summary**, **Learn**. On small screens use the fixed five-item bottom bar; show both a simple icon and its text label. On wider screens use the left navigation rail. The clickable prototype also has a state gallery available from the bottom of each page.

## Screen sequence and next action

| Screen | What the person sees | Next action |
|---|---|---|
| Home / first visit | “How are you feeling today?”, a privacy note, two optional starting points, and a plain-language scope disclaimer | Choose **Talk or type**, **Log a period date**, or **Read a short health story** |
| Talk or type | A free-text note, optional voice entry, suggested symptom chips, and a clear urgent-help card | Type or choose words, then tap **Review my notes** |
| Review your notes | Original note, editable text, extracted detail chips, optional “How much is it bothering you?” selector | Correct anything, then tap **Save my note** or **Edit note** |
| Health tracker | Date input and optional description of bleeding | Choose a date and tap **Save period date**; then confirm it appears in the list |
| Doctor summary | Optional concern, when noticed, and questions; summary preview | Fill any useful fields and tap **Create my summary**, then review the draft |
| Learn | Short myth-busting article, plain-language explanation, practical next step, more reading | Tap **Save this article** or choose another short read |
| State gallery | Empty, loading, error, and urgent message examples | Use the relevant retry or start action |

## Visual system

- **Canvas:** warm off-white `#F6F8F2`; cards `#FFFFFF`; body text deep green `#173D38`.
- **Primary action:** green `#176B59`, with white text. Hover/darker state `#125344`.
- **Supporting color:** pale mint `#E4F2EB`; pale lilac `#F0EBFA` for reflective or learning content.
- **Urgent:** coral red `#B54136` on pale coral `#FFF0ED`; add a thick left rule and direct action language. Do not use color alone to communicate urgency.
- **Typography:** system sans-serif, 16px body baseline, 28–38px page titles, 20px section headings. Use short sentences, generous line-height, and no all-caps labels.
- **Shape and spacing:** rounded cards (22px), controls (14–15px), pill chips; 8px spacing rhythm, comfortable 44px minimum touch targets.
- **Icons:** use only beside a visible text label. Keep icons decorative (`aria-hidden`) unless they are part of an explicitly labelled control. Never rely on icon recognition alone.
- **Responsive behavior:** desktop left rail, mobile fixed bottom navigation. Keep content in one column on mobile and buttons full width where helpful.

## Reusable components and exact labels

| Component | Use and sample text |
|---|---|
| Primary button | Filled green, high contrast: **Talk or type**, **Review my notes**, **Save period date**, **Create my summary** |
| Secondary button | White with green outline: **Log a period date**, **Edit note**, **Add a date** |
| Symptom chip | Selectable, plain words: **Pain**, **Bleeding**, **Feeling tired**, **Feeling sick**, **Something else**; selected state also uses `aria-pressed` |
| Language selector | Label **Language**; options **English**, **हिन्दी**, **বাংলা**, **தமிழ்**. Production must ship complete, reviewed translations for every screen and spoken content |
| Progress indicator | **Step 1 of 2 — Tell us** and **Step 2 of 2 — Check**; pair text with the visual progress bar |
| Disclaimer banner | “Luna Her shares general information. It cannot diagnose a health problem or replace a health worker.” |
| Urgent warning card | **Get help now if you feel in immediate danger** plus “If you feel very unwell or unsafe, contact local emergency help or a trusted person near you now.” Provide **Show help options** |
| Empty state | **No notes yet** / “Your notes will show here when you add them. Start with one thing you noticed.” / **Add a note** |
| Loading state | “Please wait while we prepare your notes. This may take a moment.” Use a labelled, non-interactive skeleton and announce status to assistive technology |
| Error state | **Your note did not save** / “Check your connection, then try again. Your typed words are still here.” / **Try again** |

### Inputs and helper text

| Input label | Helper text |
|---|---|
| **Your note** | “For example: ‘My lower belly has felt sore since yesterday.’ Add when it started, if you remember.” |
| **How much is it bothering you?** | “There is no right answer. Choose what feels closest.” Options: **A little**, **Some**, **A lot**, **Not sure** |
| **What date did it start?** | “Choose the first day of your period. An estimate is okay.” |
| **How was the bleeding?** | “This is optional. Pick the closest description.” Options: **Light**, **Usual for me**, **Heavy**, **Not sure** |
| **What would you like to talk about?** | “Write this in your own words. You can change it later.” |
| **When did you first notice this?** | “A date or rough amount of time is helpful, if you know.” |
| **Questions for the health worker** | “Add any questions you do not want to forget.” |

## Empty, loading, error, and urgent guidance

- **No data:** explain what will appear and offer a direct, optional action. Avoid implying that tracking is required.
- **Loading:** keep the person's own text visible; say what the app is doing and that it may take a moment. Mark the status region politely for screen readers.
- **Save failure:** name the failed action, give one recovery step, preserve entered text, and offer **Try again**.
- **Urgency:** reserve coral for immediate safety guidance, state the action clearly, and use locally reviewed emergency resources. The demo wording is generic and must be localized before release; do not infer urgency from a symptom list or give diagnosis.

## Five-hour hackathon build guide

1. **0:00–0:30 — foundation:** agree on the promise, language scope, privacy behavior, and local emergency-resource owner. Keep this demo as a client-side prototype; do not collect real health data.
2. **0:30–1:15 — shell and visual tokens:** build the responsive navigation, typography, buttons, cards, chips, banners, and focus states from this guide.
3. **1:15–2:15 — core note flow:** implement free text, optional voice affordance, review/edit, visible scope disclaimer, and save confirmation. Keep original text if saving fails.
4. **2:15–3:00 — period tracker:** add optional date entry and list rendering. Do not forecast or interpret dates in the hackathon build.
5. **3:00–3:45 — doctor summary and Learn:** assemble an editable, user-controlled summary and one reviewed, plain-language article.
6. **3:45–4:30 — states and accessibility:** add empty/loading/error/urgent states, keyboard focus, labels, screen-reader status messages, 44px targets, contrast checks, and a small-screen pass.
7. **4:30–5:00 — content and handoff:** have a women’s health reviewer check all wording, complete the supported-language decision, and demo each path with sample data only.

## Content and accessibility rules

- Speak to the person (“you”), use everyday words, and explain any necessary health term in the same sentence.
- Prefer “can sometimes be related to” or “may have many causes.” Never say a symptom proves or means a condition.
- Do not present example symptoms as a diagnosis, make treatment promises, or claim the app replaces care.
- Put one clear next step on every screen. Keep alternatives optional and explain what a button will do.
- Use visible labels, helper text below each input, keyboard-operable controls, readable focus rings, semantic headings, and text plus color for status.
- Validate translations with fluent speakers and local health reviewers; do not ship a translated language selector with untranslated screens.
- Keep voice input, storage, sharing, emergency contacts, and all health content explicit about what is and is not implemented.

## Prototype limitations

`prototype.html` is a self-contained interactive concept for review and sits beside the existing application entry point. English is the only complete language in the demo; the other selector values show a notice rather than translating the experience. Voice input, persistent storage, real sharing, and region-specific emergency contacts are not connected. The period tracker does not predict cycles. Replace all demo content with clinician-reviewed, locally appropriate material before a public release.
