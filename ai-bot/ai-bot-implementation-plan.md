# AI Chatbot (RAG) — Implementation Plan
**Project:** O.G. Agency Infrastructure — `ai-bot/` + `website/` integration
**Stack:** Node.js/Express (ai-bot backend), Next.js (website), Gemini (primary LLM) + Groq (fallback)
**Scope:** FAQ-answering chatbot (recruitment process, visas, services) — static knowledge base, no live backend data for v1

---

## Phase 0 — Setup (Day 1)

- [ ] Open the repo in Antigravity IDE, work only inside `ai-bot/` and `website/`
- [ ] Get API keys:
  - Gemini: https://aistudio.google.com/apikey
  - Groq: https://console.groq.com/keys
- [ ] Inside `ai-bot/`, run `npm init -y`
- [ ] Install core deps:
  ```bash
  npm install express dotenv cors
  npm install @google/generative-ai groq-sdk
  npm install -D nodemon
  ```
- [ ] Create `.env` (and a `.env.example` with blank values, commit only the example):
  ```
  GEMINI_API_KEY=
  GROQ_API_KEY=
  PORT=4000
  ALLOWED_ORIGIN=https://your-website-domain.com
  ```
- [ ] Confirm `.gitignore` at repo root excludes `ai-bot/.env` and `ai-bot/node_modules`

---

## Phase 1 — Folder Scaffolding

Inside `ai-bot/`, create:
```
ai-bot/
├── src/
│   ├── server.js
│   ├── routes/chat.js
│   ├── rag/
│   │   ├── knowledge/          # your FAQ source files (.md or .json)
│   │   ├── embed.js            # build-time embedding script
│   │   └── retrieve.js         # query-time similarity search
│   ├── llm/
│   │   ├── gemini.js
│   │   ├── groq.js
│   │   └── generate.js
│   └── config/
│       └── prompts.js
├── data/
│   └── embeddings.json         # generated, do not hand-edit
├── .env
├── .env.example
└── package.json
```

---

## Phase 2 — Knowledge Base Content (Day 1–2)

This is the step **you** need to do first — I can't invent your agency's real policies.

- [ ] Gather source content: services offered, recruitment process steps, visa/document checklist, fees/timelines, office contact info, common candidate questions
- [ ] Write it into `ai-bot/src/rag/knowledge/` as small, self-contained files — one topic per file, e.g.:
  - `process.md`, `visa-requirements.md`, `services.md`, `fees.md`, `contact.md`
- [ ] Keep each entry short and factual (a paragraph or Q&A pair) — this becomes your retrieval "chunks"

**Tip:** structure each file as Q&A pairs. It embeds and retrieves more accurately than long prose:
```md
Q: What documents do I need to apply for a job abroad through your agency?
A: You'll need a valid passport, CV, educational certificates, medical clearance...
```

---

## Phase 3 — Embedding Pipeline (Day 2–3)

- [ ] Write `rag/embed.js`: reads all files in `knowledge/`, splits into chunks (per Q&A pair or ~500 tokens), calls Gemini's embedding model (`text-embedding-004`) for each chunk, saves `{ text, source, vector }[]` to `data/embeddings.json`
- [ ] Add npm script: `"embed": "node src/rag/embed.js"`
- [ ] Run it: `npm run embed` — re-run any time knowledge files change
- [ ] Write `rag/retrieve.js`: takes a user question → embeds it → cosine similarity against `embeddings.json` → returns top 3–5 chunks

*(No external vector DB needed at FAQ scale — an in-memory/JSON store is enough. Revisit only if content grows past a few hundred entries.)*

---

## Phase 4 — LLM Integration with Failsafe (Day 3–4)

- [ ] `llm/gemini.js` — function that takes `(question, contextChunks)`, builds prompt, calls Gemini `generateContent`, returns text
- [ ] `llm/groq.js` — same signature, calls Groq's chat completion (e.g. `llama-3.1-8b-instant` or similar) as the fallback
- [ ] `llm/generate.js` — orchestrator:
  ```js
  async function generateAnswer(question, context) {
    try {
      return await callGemini(question, context);
    } catch (err) {
      console.warn('Gemini failed, falling back to Groq:', err.message);
      return await callGroq(question, context);
    }
  }
  ```
- [ ] `config/prompts.js` — system prompt that:
  - Restricts answers to the provided context only
  - Keeps tone professional/helpful, on-topic for recruitment
  - Falls back to "I don't have that info — please contact our team at [contact]" instead of guessing (important for visa/legal-adjacent answers)

---

## Phase 5 — Express API (Day 4)

- [ ] `server.js` — Express app, CORS restricted to your website domain, JSON body parsing
- [ ] `routes/chat.js`:
  ```
  POST /api/chat
  Body: { message: string, sessionId?: string }
  → retrieve(message) → generateAnswer(message, chunks) → { reply: string }
  ```
- [ ] Add basic input validation (empty/oversized messages) and try/catch with a generic error response
- [ ] Add npm script: `"dev": "nodemon src/server.js"`
- [ ] Test locally with `curl` or Postman before touching the frontend

---

## Phase 6 — Frontend Wiring (Day 5)

- [ ] Locate the existing chatbot widget component in `website/`
- [ ] Add a fetch call to your ai-bot endpoint (env var for the URL, e.g. `NEXT_PUBLIC_CHATBOT_API_URL`)
- [ ] Wire up: send message on submit → show loading state → render reply → keep conversation history in local component state (no backend session storage needed for v1)
- [ ] Handle errors gracefully (e.g. "Something went wrong, please try again or contact us directly")
- [ ] Test end-to-end: open the site, click the icon, ask a real FAQ question

*(Send me the actual widget component code when you're ready for this phase — I can write the exact integration instead of a generic outline.)*

---

## Phase 7 — Testing & Guardrails (Day 5–6)

- [ ] Test with real candidate-style questions (including ones NOT in your knowledge base — confirm it says "I don't know" instead of hallucinating)
- [ ] Test the failsafe: temporarily break the Gemini key and confirm Groq picks up the request
- [ ] Add basic rate limiting (`express-rate-limit`) to prevent abuse
- [ ] Add minimal logging (question + which model answered) for later review/improvement

---

## Phase 8 — Deployment

- [ ] Decide hosting for `ai-bot` (Render/Railway/VPS/same server as `backend/` — depends on your infra access)
- [ ] Set environment variables on the host (never commit real keys)
- [ ] Point `NEXT_PUBLIC_CHATBOT_API_URL` in the website's production env to the deployed ai-bot URL
- [ ] Smoke-test in production

---

## Later / Optional (v2)

- Live job-listing lookups (tool-calling into `backend/` API)
- Lead capture (collect name/email mid-conversation, forward to CRM)
- Multi-language support if candidates come from non-English-speaking regions
- Swap JSON vector store for a proper vector DB if knowledge base grows large

---

### Where to start right now
1. Phase 0 (setup) + Phase 1 (scaffolding) — I can generate this boilerplate for you directly if you'd like.
2. Phase 2 (knowledge content) — you gather the real FAQ content in parallel.

Let me know which phase you want actual code for first.
