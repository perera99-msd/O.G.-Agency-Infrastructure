const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const KNOWLEDGE_DIR = path.join(__dirname, 'knowledge');
const OUTPUT_FILE = path.join(__dirname, '../../data/embeddings.json');

// Helper to calculate simple term frequency vector as offline fallback
function computeFallbackVector(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }
  return freq;
}

// Split markdown content into logical chunks (by Q&A pairs or double newlines)
function parseMarkdownIntoChunks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const lines = content.split('\n');

  const chunks = [];
  let currentChunk = [];
  let currentTitle = filename.replace('.md', '');

  for (const line of lines) {
    if (line.startsWith('# ')) {
      currentTitle = line.replace('# ', '').trim();
      continue;
    }

    if (line.startsWith('Q: ') && currentChunk.length > 0) {
      const text = currentChunk.join('\n').trim();
      if (text) {
        chunks.push({
          source: filename,
          title: currentTitle,
          text
        });
      }
      currentChunk = [line];
    } else {
      currentChunk.push(line);
    }
  }

  if (currentChunk.length > 0) {
    const text = currentChunk.join('\n').trim();
    if (text) {
      chunks.push({
        source: filename,
        title: currentTitle,
        text
      });
    }
  }

  return chunks;
}

async function generateEmbeddings() {
  console.log('--- Starting Knowledge Base Embedding Pipeline ---');

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`Knowledge directory does not exist: ${KNOWLEDGE_DIR}`);
    return;
  }

  const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} knowledge markdown files:`, files);

  let allChunks = [];
  for (const file of files) {
    const filePath = path.join(KNOWLEDGE_DIR, file);
    const chunks = parseMarkdownIntoChunks(filePath);
    allChunks = allChunks.concat(chunks);
  }

  console.log(`Extracted ${allChunks.length} content chunks from knowledge base.`);

  const apiKey = process.env.GEMINI_API_KEY;
  let useGemini = Boolean(apiKey && apiKey.trim().length > 0);
  let genAI = null;
  let embeddingModel = null;

  if (useGemini) {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      console.log('Connected to Google Gemini (text-embedding-004) for embeddings.');
    } catch (err) {
      console.warn('Failed to initialize Gemini embedding model, falling back to local indexing:', err.message);
      useGemini = false;
    }
  } else {
    console.log('No GEMINI_API_KEY found in .env. Using offline term-frequency indexing.');
  }

  const processedData = [];

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    console.log(`Processing chunk [${i + 1}/${allChunks.length}] from ${chunk.source}...`);

    let vector = null;
    let embeddingType = 'local';

    if (useGemini && embeddingModel) {
      try {
        const result = await embeddingModel.embedContent(chunk.text);
        if (result && result.embedding && result.embedding.values) {
          vector = result.embedding.values;
          embeddingType = 'gemini-text-embedding-004';
        }
      } catch (err) {
        console.warn(`Gemini embedding failed for chunk ${i + 1}: ${err.message}. Using fallback vector.`);
      }
    }

    if (!vector) {
      vector = computeFallbackVector(chunk.text);
      embeddingType = 'term-frequency';
    }

    processedData.push({
      id: `chunk_${i + 1}`,
      source: chunk.source,
      title: chunk.title,
      text: chunk.text,
      embeddingType,
      vector
    });
  }

  // Ensure data directory exists
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processedData, null, 2), 'utf-8');
  console.log(`Successfully saved ${processedData.length} indexed chunks to: ${OUTPUT_FILE}`);
  console.log('--- Embedding Pipeline Complete ---');
}

if (require.main === module) {
  generateEmbeddings().catch(err => {
    console.error('Fatal error during embedding pipeline:', err);
    process.exit(1);
  });
}

module.exports = {
  generateEmbeddings,
  parseMarkdownIntoChunks,
  computeFallbackVector
};
