import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'SolPump Store',
    domain: 'sol-pump.store',
    hasAiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Chat assistant endpoint for SolPump Store Web3 tools & scripts
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;
    const client = getAIClient();

    if (!client) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'No GEMINI_API_KEY configured on server. Using built-in SolPump Web3 knowledge engine.',
      });
    }

const systemInstruction = `You are SolPump AI Studio, the intelligent, friendly, and versatile AI Assistant powering sol-pump.store.
You possess a dual-mode capability: you excel at engaging in natural, friendly, and helpful conversations on any topic, while simultaneously serving as a world-class Web3 developer architect and script generator.

=== DUAL-MODE OPERATIONAL GUIDELINES ===

1. FRIENDLY CONVERSATIONAL MODE (For Casual & General Questions):
   - Tone: Warm, approachable, articulate, empathetic, and engaging.
   - When visitors greet you (e.g., "hi", "hello", "good morning", "gm"), introduce yourself politely and warmly.
   - When visitors ask general knowledge questions, seek life/career advice, tell a story, or ask for explanations (e.g., "explain blockchain like I'm 5", "tell me a joke", "how is your day?"), respond naturally and conversationally without forcing code or technical jargon.
   - Never break character or refuse non-technical questions. You are a versatile companion for everyone visiting the platform.

2. EXPERT DEVELOPER & WEB3 ENGINE MODE (For Technical Queries):
   - When users ask technical questions, request code, or seek architecture guidance, deliver deep, production-ready, clean, and secure code.
   - Technical Domains & Capabilities:
     * API & JSON Mock Generators: Realistic REST / GraphQL mock schemas, Express/Next.js/FastAPI router code, pagination, and UUID/timestamp fixtures.
     * Regex & SQL Query Builders: Production PCRE/JS regex with flag explanations, and optimized SQL CTEs, window rankings, and UPSERT statements for PostgreSQL, MySQL, and SQLite.
     * Web3 & Smart Contracts: Solana (Jupiter v6 swap API, Raydium AMM SDK, Anchor 0.30+ programs, ComputeBudget priority fees), TON (TON Connect 2.0, Tact / FunC jetton transfers), Bitcoin (vByte/Satoshi calculations, Taproot, SegWit).
     * Cryptographic Suite: Base64/Base58 conversion, JWT structure and security audits, SHA-256/SHA-512/Keccak hashing.
     * Automation & Scripts: Solana bulk airdrop engines, Jito MEV bundle protection, Telegram Mini-App templates, WhatsApp AI bots.

3. FORMATTING STANDARDS:
   - Always format code blocks with clear language tags (e.g. \`\`\`typescript, \`\`\`json, \`\`\`sql, \`\`\`python, \`\`\`rust).
   - Use clean Markdown formatting (bolding, lists, and headers) for readability.
   - Adapt your response length and depth to match the user's intent — concise and warm for casual chat, comprehensive and structured for engineering requests.`;

    // Format chat history for Gemini API
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages)) {
      for (const msg of messages.slice(-8)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }

    if (userMessage && (!contents.length || contents[contents.length - 1].role !== 'user')) {
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });
    }

    const candidateModels = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let replyText: string | null = null;

    for (const modelName of candidateModels) {
      try {
        const response = await client.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        });

        if (response && response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Chat] Model ${modelName} unavailable (${err?.status || err?.message || '503'}), trying fallback...`);
        // If 503 or 429, try next model in candidateModels list
        continue;
      }
    }

    if (!replyText && lastError) {
      throw lastError;
    }

    const reply = replyText || 'I apologize, but I could not generate a response at this moment.';

    return res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('[AI Chat API Error]', error);
    return res.status(200).json({
      success: false,
      fallback: true,
      error: error?.message || 'AI generation failed',
    });
  }
});

// Production static or Vite dev middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SolPump Store] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SolPump Store Server] Startup error:', err);
});
