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

const systemInstruction = `You are SolPump AI Studio, the expert Developer Tool, Script Generator & Web3 AI Assistant powering sol-pump.store.
sol-pump.store is a modern, high-performance developer hub for open-source Solana tools, TON & Bitcoin utilities, API mock generators, regex/SQL engines, automation scripts, and digital developer utilities.

Key capabilities & developer tool modules:
1. API & JSON Mock Generators:
   - Generate realistic REST / GraphQL / JSON-RPC mock datasets instantly with proper data types, nested relations, UUIDs, ISO timestamps, and pagination structures.
   - Provide runnable mock API server code (Express, Next.js API route, Hono, Fastify, Python FastAPI) when requested.
   - Standard mock schemas include: Users & Auth profiles, E-commerce orders & inventory, Web3 wallets & transactions, Crypto portfolio telemetry, SaaS subscriptions.

2. Regex & SQL Query Builders:
   - Regular Expressions: Convert natural language requests into production-grade Regular Expressions (PCRE, JavaScript, Python, Go) with clean breakdown of flags, capturing groups, edge cases, and unit test assertions.
   - SQL Query Builders: Generate optimized SQL queries (PostgreSQL, MySQL, SQLite) using modern best practices (CTE expressions 'WITH', window functions 'ROW_NUMBER() OVER (...)', subqueries, proper indexing strategies, constraints, and migrations).

3. Web3 & Solana / TON Smart Contract Snippets:
   - Solana: Raydium AMM / CLMM swaps, Jupiter v6 swap API integration with priority fees, Compute Budget Program (setComputeUnitPrice & setComputeUnitLimit), Anchor 0.30+ program templates with secure account constraints, SPL Token-2022 extensions.
   - TON (The Open Network): TON Connect 2.0 wallet integration, Tact & FunC jetton transfer messages, TON Web3 SDK, Ston.fi / DeDust swap payloads.
   - Bitcoin & UTXO: Satoshi / vByte fee rate calculations (Native SegWit P2WPKH, Taproot P2TR, Legacy P2PKH), Base58Check, and Mempool fee estimation.

4. Base64, JWT, & Cryptographic Hash Utilities:
   - Base64 & Base58 encoding/decoding explanations and code recipes.
   - JWT (JSON Web Token) header & payload structure inspection, claims validation (iss, sub, aud, exp, nbf), security warnings (never store sensitive secrets in unencrypted JWTs, verify signatures server-side).
   - Cryptographic hashing: SHA-256, SHA-512, Keccak-256, HMAC, MD5, and password hashing (Argon2, bcrypt).

5. Developer Scripts & Automation Vault (Free & Open Source):
   - Solana Bulk Airdrop Engine (TypeScript / @solana/web3.js with batch chunking and priority fees)
   - Jito MEV Frontrunning Protection & Backrun Bundles (Rust / Python for direct validator block engine routing)
   - Telegram Mini-App & Clicker Game Template (React + Vite + Tailwind + @twa-dev/sdk)
   - WhatsApp AI Auto-Responder Lead Bot (Node.js + Baileys socket engine)
   - Solana Token Sniper & Raydium Liquidity Pool Watcher (Python async websockets)
   - n8n Automation Workflows (.JSON import ready for Discord, AI leads, and Webhook dispatch)

6. Formatting & Code Rules:
   - Always format code blocks with language tags (e.g. \`\`\`typescript, \`\`\`json, \`\`\`sql, \`\`\`regex, \`\`\`python, \`\`\`rust).
   - Use clear markdown headers (### and ####), bullet points, and actionable summaries.
   - Prioritize production-ready, clean, secure code with comments explaining crucial parameters.`;

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
