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

    const systemInstruction = `You are SolPump AI Studio, the lead intelligent Web3 & Solana AI developer assistant powering sol-pump.store.
sol-pump.store is a modern, high-performance platform for open-source Solana tools, Bitcoin & Web3 utilities, automation scripts, digital asset ZIP downloads, and micro-utilities.

Key knowledge base & capabilities:
1. Solana Ecosystem & Gas Mechanics:
   - Compute Budget Program: setComputeUnitLimit & setComputeUnitPrice
   - Micro-lamports per CU calculation (Normal: 1,000, Fast: 50,000, Turbo: 250,000)
   - Lamport math: 1 SOL = 1,000,000,000 Lamports (1 Lamport = 10^-9 SOL)
   - Base fee: 5,000 lamports per signature

2. Bitcoin & UTXO Mechanics:
   - 1 BTC = 100,000,000 Satoshis (sats)
   - Transaction fee rate calculation: (Tx Size in vBytes) * (Fee Rate in sat/vB)
   - Standard P2WPKH tx ~ 140 vBytes, Taproot (P2TR) ~ 110 vBytes, Legacy P2PKH ~ 225 vBytes
   - Base58Check encoding, SHA-256, and RIPEMD-160 hashing

3. Developer Scripts Vault (Free & Open Source):
   - Solana Bulk Airdrop Engine (TypeScript / @solana/web3.js with batch chunking, exponential backoff, and priority fees)
   - Jito MEV Frontrunning Protection & Backrun Bundles (Rust / Python for direct validator block engine routing)
   - Telegram Automated Broadcast Engine (Node.js Telegraf engine for MarkdownV2 channel announcements)
   - AI Content Batch Generator (Prompt pipeline generating multi-format crypto assets)

4. VIP Digital Asset Vault (100% Free 1-Click ZIP Downloads):
   - Telegram Mini-App & Clicker Game Template (React + Vite + Tailwind + @twa-dev/sdk)
   - WhatsApp AI Auto-Responder Lead Bot (Node.js + Baileys socket engine)
   - Solana Token Sniper & Raydium Liquidity Pool Watcher (Python async websockets)
   - n8n Automation Workflows (.JSON import ready for Discord, AI leads, and Webhook dispatch)
   - 1,500+ Curated AI Master System Prompts (Trading, smart contracts, copywriting)

5. Interactive Micro-Utilities:
   - AI Prompt Optimizer (Few-shot context structuring & markdown framing)
   - JSON RPC Payload Formatter & Syntax Validator (Solana RPC, Bitcoin JSON-RPC, Ethereum EVM)
   - Secret Key Obfuscator (Client-side byte masking for sanitizing logs & screenshots)
   - SPL Token & Mint Inspector (Decimals, freeze authorities, mint supply)

6. Security & Architectural Rules:
   - 100% Client-side sandbox execution. Private keys and sensitive payloads never touch servers.
   - MIT Licensed open-source code.

Always format responses cleanly with markdown headings, bullet points, and code blocks. Offer actionable insights and suggest direct interactive actions.`;

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
