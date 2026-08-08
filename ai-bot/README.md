# O.G. Agency — AI Chatbot Microservice (`ai-bot`)

A RAG (Retrieval-Augmented Generation) FAQ & recruitment assistant microservice powered by **Express.js**, **Google Gemini** (Primary), **Groq / Llama 3.1** (Fallback), and a local vector knowledge base.

---

## 🏗️ Architecture Overview

- **Backend:** Express REST API running on port `4000`.
- **Knowledge Base:** Markdown documents in `src/rag/knowledge/` covering recruitment processes, visa checklists, fees, and office contact info.
- **RAG Pipeline:** Offline and embedding-driven similarity search (`data/embeddings.json`).
- **LLM Multi-Tier Orchestrator:**
  1. Primary: **Google Gemini** (`gemini-2.0-flash`)
  2. Fallback: **Groq** (`llama-3.1-8b-instant`)
  3. Grounded Fallback: Direct knowledge-base extract if API limits are reached.
- **Frontend Integration:** Next.js widget at `website/components/chat/AIChatBot.tsx`.

---

## 🚀 Quick Start for Developers

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **API Keys**:
  - Google Gemini API Key ([Get one free at Google AI Studio](https://aistudio.google.com/apikey))
  - Groq API Key ([Get one free at Groq Console](https://console.groq.com/keys))

---

### 2. Environment Configuration
Inside the `ai-bot/` directory, copy the example environment file:

```bash
cd ai-bot
cp .env.example .env
```

Edit `.env` and fill in your keys:
```env
PORT=4000
ALLOWED_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

---

### 3. Install Dependencies & Build Knowledge Embeddings

```bash
# Install packages
npm install

# Parse markdown FAQs and generate vector embeddings
npm run embed
```

> **Note:** Whenever you add or edit files inside `src/rag/knowledge/`, re-run `npm run embed`.

---

### 4. Start the Service

```bash
# Production mode
npm start

# Development mode (auto-reload on changes)
npm run dev
```

The service will start on `http://localhost:4000`.

---

## 🧪 Testing the Service

### 1. Health Check
```bash
# macOS/Linux/Git Bash
curl http://localhost:4000/api/health

# PowerShell
Invoke-RestMethod -Uri http://localhost:4000/api/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "service": "og-agency-ai-bot",
  "timestamp": "2026-08-08T..."
}
```

---

### 2. Test Chat Endpoint (CLI)
```bash
# macOS/Linux/Git Bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What documents do I need for a visa?"}'

# PowerShell (Node.js one-liner)
node -e "fetch('http://localhost:4000/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'What documents do I need for a visa?' }) }).then(r => r.json()).then(console.log)"
```

---

### 3. Testing with the Next.js Frontend (`website/`)

1. In a separate terminal, start the Next.js website:
   ```bash
   cd website
   npm install
   npm run dev
   ```
2. Open `http://localhost:3000` in your browser.
3. Click the floating animated AI bot in the bottom-right corner.
4. Click any suggestion chip (e.g. *💡 What documents do I need for a visa?*) or type your own question.

---

## 📂 Project Structure

```
ai-bot/
├── src/
│   ├── server.js              # Express server setup (CORS, rate limiting, healthcheck)
│   ├── routes/
│   │   └── chat.js            # POST /api/chat endpoint
│   ├── rag/
│   │   ├── knowledge/         # Markdown source files (FAQ data)
│   │   │   ├── contact.md
│   │   │   ├── fees.md
│   │   │   ├── process.md
│   │   │   ├── services.md
│   │   │   └── visa-requirements.md
│   │   ├── embed.js           # Build-time embedding script
│   │   └── retrieve.js        # Query-time cosine & term similarity search
│   ├── llm/
│   │   ├── gemini.js          # Google Gemini provider
│   │   ├── groq.js            # Groq / Llama-3.1 fallback provider
│   │   └── generate.js        # Multi-tier orchestrator
│   └── config/
│       └── prompts.js         # System prompts and guardrails
├── data/
│   └── embeddings.json        # Generated vectors and chunk data
├── .env.example               # Environment variables template
├── package.json
└── README.md
```
