const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const EMBEDDINGS_FILE = path.join(__dirname, '../../data/embeddings.json');

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
 * Retrieve top K chunks matching the user question
 * @param {string} question 
 * @param {number} topK 
 * @returns {Promise<Array<{ text: string, source: string, score: number, title: string }>>}
 */
async function retrieveContext(question, topK = 5) {
  if (!question || typeof question !== 'string' || !question.trim()) {
    return [];
  }

  const embeddings = cachedEmbeddings || loadEmbeddings();
  if (!embeddings || embeddings.length === 0) {
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

  const scoredChunks = embeddings.map(chunk => {
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

  // Sort descending by score
  scoredChunks.sort((a, b) => b.score - a.score);

  // Return top K items
  return scoredChunks.slice(0, topK);
}

module.exports = {
  retrieveContext,
  loadEmbeddings,
  cosineSimilarity,
  termSimilarity
};
