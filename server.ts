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

// Image generation endpoint using Gemini Image models with SVG procedural fallback
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const client = getAIClient();
    let imageUrl: string | null = null;
    let modelUsed: string = 'fallback-vector';

    if (client) {
      const imageModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];
      for (const modelName of imageModels) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: {
              parts: [{ text: prompt }],
            },
            config: {
              imageConfig: {
                aspectRatio: (['1:1', '16:9', '4:3', '9:16', '3:4'].includes(aspectRatio) ? aspectRatio : '1:1') as any,
              },
            },
          });

          const candidates = response?.candidates;
          if (candidates && candidates[0]?.content?.parts) {
            for (const part of candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                const mime = part.inlineData.mimeType || 'image/png';
                imageUrl = `data:${mime};base64,${part.inlineData.data}`;
                modelUsed = modelName;
                break;
              }
            }
          }
          if (imageUrl) break;
        } catch (err: any) {
          console.warn(`[Image Gen] Model ${modelName} failed (${err?.message || err}), trying next...`);
        }
      }
    }

    // High-fidelity fallback vector generator if API key is not configured or image model quota is exceeded
    if (!imageUrl) {
      const cleanPrompt = prompt.trim();
      const isSolana = /solana|sol|pump/i.test(cleanPrompt);
      const isBtc = /bitcoin|btc|satoshi/i.test(cleanPrompt);
      const isEth = /ethereum|eth|evm/i.test(cleanPrompt);
      const isUi = /ui|dashboard|mockup|interface|app/i.test(cleanPrompt);

      let primaryColor = '#06b6d4'; // cyan-500
      let secondaryColor = '#8b5cf6'; // purple-500
      let accentColor = '#10b981'; // emerald-500
      let symbol = '⚡';

      if (isSolana) {
        primaryColor = '#14F195';
        secondaryColor = '#9945FF';
        accentColor = '#00C2FF';
        symbol = '◎';
      } else if (isBtc) {
        primaryColor = '#F7931A';
        secondaryColor = '#FFD700';
        accentColor = '#FFA500';
        symbol = '₿';
      } else if (isEth) {
        primaryColor = '#627EEA';
        secondaryColor = '#A0B9FB';
        accentColor = '#3B82F6';
        symbol = 'Ξ';
      } else if (isUi) {
        primaryColor = '#38bdf8';
        secondaryColor = '#6366f1';
        accentColor = '#ec4899';
        symbol = '✦';
      }

      const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#0a0b10" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#050608" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="50%" stop-color="${secondaryColor}" />
      <stop offset="100%" stop-color="${accentColor}" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141824" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#0a0d16" stop-opacity="0.9" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Obsidian Background -->
  <rect width="800" height="800" fill="#06070a" />
  <rect width="800" height="800" fill="url(#bgGlow)" />
  <rect width="800" height="800" fill="url(#grid)" />

  <!-- Outer Halo Rings -->
  <circle cx="400" cy="400" r="280" fill="none" stroke="${primaryColor}" stroke-opacity="0.12" stroke-width="2" stroke-dasharray="8 12" />
  <circle cx="400" cy="400" r="230" fill="none" stroke="${secondaryColor}" stroke-opacity="0.2" stroke-width="1.5" />
  
  <!-- Central Emblem Geometry -->
  <g filter="url(#glow)">
    <polygon points="400,180 590,290 590,510 400,620 210,510 210,290" fill="url(#cardGrad)" stroke="url(#cyberGrad)" stroke-width="4" rx="20" />
    <circle cx="400" cy="400" r="130" fill="#0b0e17" stroke="${primaryColor}" stroke-width="2.5" />
    
    <!-- Central Icon/Symbol -->
    <text x="400" y="435" font-family="system-ui, -apple-system, sans-serif" font-size="96" font-weight="900" fill="url(#cyberGrad)" text-anchor="middle" dominant-baseline="central">
      ${symbol}
    </text>
  </g>

  <!-- Cyber Node Indicators -->
  <circle cx="400" cy="180" r="8" fill="${primaryColor}" />
  <circle cx="590" cy="290" r="8" fill="${secondaryColor}" />
  <circle cx="590" cy="510" r="8" fill="${accentColor}" />
  <circle cx="400" cy="620" r="8" fill="${primaryColor}" />
  <circle cx="210" cy="510" r="8" fill="${secondaryColor}" />
  <circle cx="210" cy="290" r="8" fill="${accentColor}" />

  <!-- Prompt Badge Footprint -->
  <rect x="140" y="700" width="520" height="42" rx="21" fill="#0b0e17" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
  <text x="400" y="726" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#94a3b8" text-anchor="middle">
    ${cleanPrompt.length > 55 ? cleanPrompt.substring(0, 52) + '...' : cleanPrompt}
  </text>
</svg>
`.trim();

      const encodedSvg = Buffer.from(svgContent).toString('base64');
      imageUrl = `data:image/svg+xml;base64,${encodedSvg}`;
      modelUsed = 'procedural-vector-engine';
    }

    return res.json({
      success: true,
      imageUrl,
      prompt,
      modelUsed,
    });
  } catch (err: any) {
    console.error('[Generate Image Error]', err);
    return res.status(500).json({ success: false, error: err.message || 'Image generation failed' });
  }
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
You possess a dual-mode capability: you excel at engaging in natural, friendly, and helpful conversations on any topic, while simultaneously serving as a world-class Game Development & Web3 engineering architect and logic script generator.

=== AUTONOMOUS NATIVE MULTI-LANGUAGE DETECTION & MOROCCAN DARIJA FLUENCY ===
- **100% Autonomous Zero-Config Language Detection**: You autonomously and silently detect the user's language, dialect, or writing script from their message without requiring any user configuration, button, or settings.
- **Dynamic Mirror-Language Matching**: Always formulate your response in the EXACT same language, dialect, or register the user used:
  * **Moroccan Darija (الدارجة المغربية)**: Deep, native, culturally authentic fluency in Moroccan Darija in both Arabic script (الدارجة بالحروف العربية) and Latin Arabizi (e.g. "salam khoya", "ki dayr", "kifach nsayb bot", "3tini script dyal unity", "lah yhfdek", "bghit n3ref kifach").
    - Reply naturally and warmly in authentic Moroccan Darija (e.g., "وعليكم السلام خويا العزيز! مرحبا بيك فـ SolPump. كيداير وكيفاش نقدر نعاونك اليوم؟").
    - Use authentic expressions (خويا، أختي، مرحبا، كيداير، ناضي، بالرجولة، الله يحفظك، تبارك الله، ماكاين حتى مشكل، على الراس والعين) with high emotional intelligence and technical clarity.
  * **Modern Standard Arabic (العربية الفصحى)**: Respond with eloquent, grammatically sound, and precise Arabic.
  * **French (Français)**: Respond in natural, fluent French.
  * **Spanish (Español)**: Respond in fluent Spanish.
  * **English**: Respond in clear, articulate English.
  * **Any other language or dialect**: Detect it natively and respond in that language.
- When explaining complex technical, Web3, or Game Dev concepts in Darija or other languages, seamlessly blend accurate technical terminology with natural phrasing so it feels effortless, intuitive, and professional.

=== DUAL-MODE OPERATIONAL GUIDELINES ===

1. FRIENDLY CONVERSATIONAL MODE (For Casual & General Questions):
   - Tone: Warm, approachable, articulate, empathetic, and engaging.
   - When visitors greet you (e.g., "hi", "hello", "salam", "bonjour", "gm"), introduce yourself politely and warmly.
   - When visitors ask general knowledge questions, seek life/career advice, tell a story, or ask for explanations (e.g., "explain blockchain like I'm 5", "tell me a joke", "how is your day?"), respond naturally and conversationally without forcing code or technical jargon.
   - Never break character or refuse non-technical questions. You are a versatile companion for everyone visiting the platform.

2. EXPERT GAME DEV & TECHNICAL ENGINE MODE (For Technical Queries):
   - When users ask technical questions, request code, or seek architecture guidance, deliver deep, production-ready, clean, and secure code.
   - Technical Domains & Capabilities:
     * Game Dev & Logic Scripts: Unity C# character controllers & physics, Godot 4.x GDScript movement & state machines, Telegram Mini-App HTML5 Canvas / Phaser game loops, WebGL / Three.js shaders & interactive loops, and Unreal C++ gameplay actors.
     * NPC, Dialogue & Lore Builder: Branching dialogue trees with conditional choices, dynamic quest logs with rewards/prerequisites, and rich NPC backstories formatted in clean, structured JSON schemas.
     * API & JSON Mock Generators: Realistic REST / GraphQL mock schemas, Express/Next.js/FastAPI router code, pagination, and UUID/timestamp fixtures.
     * Regex & SQL Query Builders: Production PCRE/JS regex with flag explanations, and optimized SQL CTEs, window rankings, and UPSERT statements for PostgreSQL, MySQL, and SQLite.
     * Web3 & Smart Contracts: Solana (Jupiter v6 swap API, Raydium AMM SDK, Anchor 0.30+ programs, ComputeBudget priority fees), TON (TON Connect 2.0, Tact / FunC jetton transfers), Bitcoin (vByte/Satoshi calculations, Taproot, SegWit).
     * Cryptographic Suite: Base64/Base58 conversion, JWT structure and security audits, SHA-256/SHA-512/Keccak hashing.
     * Automation & Scripts: Solana bulk airdrop engines, Jito MEV bundle protection, Telegram Mini-App templates, WhatsApp AI bots.

3. FORMATTING STANDARDS:
   - Always format code blocks with clear language tags (e.g. \`\`\`csharp, \`\`\`gdscript, \`\`\`typescript, \`\`\`json, \`\`\`sql, \`\`\`python, \`\`\`rust, \`\`\`cpp).
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
