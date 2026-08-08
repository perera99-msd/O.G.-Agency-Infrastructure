const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const EMBEDDINGS_FILE = path.join(__dirname, '../../data/embeddings.json');
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api/v1/website';

// Helper: Cosine similarity for numerical vectors
function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Helper: Term overlap / TF similarity with title boosting
function termSimilarity(queryText, termFreqObj, chunk) {
  const queryTerms = queryText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  if (queryTerms.length === 0) return 0;

  let score = 0;
  const chunkTextLower = (chunk.text || '').toLowerCase();
  const chunkTitleLower = (chunk.title || '').toLowerCase();

  for (const term of queryTerms) {
    if (term.length <= 2) continue; // Skip single/two letter noise words

    if (termFreqObj && termFreqObj[term]) {
      score += termFreqObj[term];
    }
    if (chunkTitleLower.includes(term)) {
      score += 3.0; // Boost if matched in title
    }
    if (chunkTextLower.includes(term)) {
      score += 1.5; // Boost if phrase exists in text
    }
  }

  return score;
}

// Cache embeddings in memory
let cachedEmbeddings = null;

function loadEmbeddings() {
  if (!fs.existsSync(EMBEDDINGS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(EMBEDDINGS_FILE, 'utf-8');
    cachedEmbeddings = JSON.parse(raw);
    return cachedEmbeddings;
  } catch (err) {
    console.error('Error reading embeddings file:', err);
    return [];
  }
}

/**
 * Dynamically query the Backend API / Firestore for live jobs and countries
 */
async function fetchLiveDatabaseContext(question) {
  const qLower = question.toLowerCase();
  const isJobQuery = /job|vacancy|vacancies|opening|openings|hiring|work|career|position/i.test(qLower);
  const isCountryQuery = /country|countries|destination|destinations|romania|qatar|dubai|saudi|kuwait|oman/i.test(qLower);

  if (!isJobQuery && !isCountryQuery) {
    return [];
  }

  const liveChunks = [];

  if (isJobQuery) {
    try {
      const res = await fetch(`${BACKEND_URL}/jobs`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const jobsSummary = json.data.map((j, idx) => 
            `${idx + 1}. Job Title: ${j.title || j.role || 'N/A'} | Country: ${j.country || 'N/A'} | Category: ${j.category || 'General'} | Deadline: ${j.deadline || 'Open'}`
          ).join('\n');

          liveChunks.push({
            id: 'live-jobs-db',
            source: 'Firestore Database (Live Vacancies)',
            title: 'Current Active Job Openings',
            text: `Here are the official currently active job vacancies in the O.G. Agency database:\n${jobsSummary}\n\nCandidates can apply on our Jobs page (https://ogagency.com/jobs) or send their CV to info@ogagency.lk.`,
            score: 10.0
          });
        }
      }
    } catch (err) {
      console.warn('[RAG] Live jobs fetch failed/timed out:', err.message);
    }
  }

  if (isCountryQuery) {
    try {
      const res = await fetch(`${BACKEND_URL}/destinations`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const countrySummary = json.data.map(d => `- ${d.country} (${d.status || 'Active'})`).join('\n');

          liveChunks.push({
            id: 'live-destinations-db',
            source: 'Firestore Database (Live Destinations)',
            title: 'Current Active Destination Countries',
            text: `O.G. Agency currently recruits and places workers for the following active destination countries in our database:\n${countrySummary}`,
            score: 10.0
          });
        }
      }
    } catch (err) {
      console.warn('[RAG] Live destinations fetch failed/timed out:', err.message);
    }
  }

  return liveChunks;
}

/**
 * Retrieve top K chunks matching the user question
 * @param {string} question 
 * @param {number} topK 
 * @returns {Promise<Array<{ text: string, source: string, score: number, title: string }>>}
 */
async function retrieveContext(question, topK = 5) {
  if (!question || typeof question !== 'string' || !question.trim()) {
    return [];
  }

  // 1. Fetch live database context for jobs/countries queries
  const liveChunks = await fetchLiveDatabaseContext(question);

  // 2. Load static embedding vectors
  const embeddings = cachedEmbeddings || loadEmbeddings();
  if ((!embeddings || embeddings.length === 0) && liveChunks.length === 0) {
    return [];
  }

  const apiKey = process.env.GEMINI_API_KEY;
  let queryVector = null;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const res = await embeddingModel.embedContent(question);
      if (res && res.embedding && res.embedding.values) {
        queryVector = res.embedding.values;
      }
    } catch (err) {
      // Offline fallback
    }
  }

  const scoredChunks = (embeddings || []).map(chunk => {
    let score = 0;
    if (queryVector && Array.isArray(chunk.vector)) {
      score = cosineSimilarity(queryVector, chunk.vector);
    } else if (typeof chunk.vector === 'object') {
      score = termSimilarity(question, chunk.vector, chunk);
    } else {
      const qLower = question.toLowerCase();
      const textLower = chunk.text.toLowerCase();
      score = textLower.includes(qLower) ? 2.0 : 0;
    }

    return {
      id: chunk.id,
      source: chunk.source,
      title: chunk.title,
      text: chunk.text,
      score
    };
  });

  // Combine live database chunks (high priority score) with top vector matches
  const combined = [...liveChunks, ...scoredChunks];
  combined.sort((a, b) => b.score - a.score);

  return combined.slice(0, topK);
}

module.exports = {
  retrieveContext,
  loadEmbeddings,
  cosineSimilarity,
  termSimilarity
};
