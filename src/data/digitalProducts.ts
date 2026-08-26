export interface DigitalProduct {
  id: string;
  title: string;
  category: 'n8n' | 'ai' | 'dev' | 'web3' | 'bundle';
  tagline: string;
  version: string;
  fileSize: string;
  formats: string[];
  description: string;
  highlights: string[];
  setupGuideSteps?: string[];
  includedFiles: { name: string; type: string; size: string; description: string }[];
  badge?: string;
  tierRequired: 'pro' | 'lifetime' | 'all_paid';
}

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'product-telegram-miniapp',
    title: 'Telegram Mini-App & Clicker Game Boilerplate',
    category: 'dev',
    tagline: 'Ready-to-Deploy TON / Telegram WebApp & Tap-to-Earn Game Engine',
    version: 'v3.2.0 (Telegram WebApp SDK 7.10+ & TON Connect)',
    fileSize: '9.4 MB (Full Source ZIP)',
    formats: ['React 19 + TypeScript', 'TON Connect 2.0', 'Telegram MiniApp SDK', 'Node.js Backend'],
    badge: '🔥 Trending · High Demand',
    tierRequired: 'all_paid',
    description:
      'Turnkey Telegram Mini-App (TMA) template engineered for tap-to-earn clicker games, TON blockchain wallet connections, multi-tier referral mechanics, and daily reward streaks. Ready for immediate launch on Telegram with zero backend friction.',
    highlights: [
      'Native Telegram WebApp SDK 7.10+ integration with haptic feedback, viewport lock, and CloudStorage',
      'TON Connect 2.0 wallet integration (Tonkeeper, Telegram Wallet, OpenMask, MyTonWallet)',
      'Optimized tap-to-earn clicker physics with floating multi-touch score multipliers and energy bars',
      'Multi-tier viral referral tree system with custom Telegram invite link generation',
      'Lightweight Node.js / Express backend with anti-cheat request rate limiting and database sync',
      'Step-by-step @BotFather setup instructions and deployment configuration (Vercel, Railway, Cloud Run)',
    ],
    setupGuideSteps: [
      'Unzip the project directory and install dependencies with `npm install`.',
      'Open @BotFather on Telegram, use `/newbot` to create your bot, and configure `/newapp` to link your web app URL.',
      'Configure `.env` with your `TELEGRAM_BOT_TOKEN`, `TON_MANIFEST_URL`, and database credentials.',
      'Run `npm run dev` to launch local preview with the Telegram WebApp mock environment.',
      'Deploy the frontend to Vercel/Cloudflare and backend to Railway/Cloud Run, then launch live in Telegram!',
    ],
    includedFiles: [
      {
        name: 'telegram-miniapp-clicker-source.zip',
        type: 'Full Project ZIP',
        size: '8.8 MB',
        description: 'Complete React 19 + Vite frontend, Express backend, assets, and sound effects.',
      },
      {
        name: 'telegram_webapp_hooks.ts',
        type: 'TypeScript Code',
        size: '38 KB',
        description: 'Custom React hooks for Telegram user data, theme params, haptics, and cloud storage.',
      },
      {
        name: 'ton_wallet_adapter.ts',
        type: 'TON Connect Code',
        size: '45 KB',
        description: 'TON Connect 2.0 wallet integration, jetton transfers, and transaction signing.',
      },
      {
        name: 'TELEGRAM_BOTFATHER_DEPLOY_GUIDE.md',
        type: 'Setup Documentation',
        size: '32 KB',
        description: 'Step-by-step @BotFather and Telegram Mini-App configuration manual.',
      },
    ],
  },
  {
    id: 'product-whatsapp-ai-leadgen',
    title: 'WhatsApp AI Auto-Responder & Lead Gen System',
    category: 'n8n',
    tagline: 'Node.js & n8n Integrated Code for 24/7 Customer Support & Sales Qualification',
    version: 'v2.6.0 (WhatsApp Cloud API + Baileys + n8n)',
    fileSize: '7.8 MB (ZIP + JSON)',
    formats: ['Node.js (TypeScript)', 'n8n Workflow JSON', 'WhatsApp Cloud API', 'Baileys Engine'],
    badge: '⚡ High Demand · AI Agent',
    tierRequired: 'all_paid',
    description:
      'Production-grade WhatsApp AI conversational agent and automated lead qualification pipeline. Combines a resilient Node.js webhook engine (supporting both official Meta WhatsApp Cloud API and Baileys QR bridge) with modular n8n workflow nodes powered by Gemini and GPT-4o.',
    highlights: [
      'Dual integration mode: Official Meta WhatsApp Cloud API or open-source Baileys QR Web engine',
      'AI-driven conversational qualification engine with dynamic lead scoring (Hot, Warm, Cold)',
      'LangChain conversational memory retaining multi-turn context and customer purchase intent',
      'Automated appointment booking, catalog showcase, and Google Calendar / CRM synchronizer',
      'Built-in rate limiter, human agent escalation routing, and anti-ban message throttling',
      'Includes complete importable n8n workflows, Docker-Compose stack, and TypeScript microservice',
    ],
    setupGuideSteps: [
      'Unzip the archive and choose your mode (Meta Cloud API or Baileys QR engine).',
      'For Cloud API: Add your Meta Business API access token and WhatsApp Phone Number ID in `.env`.',
      'For Baileys: Run `npm run start:qr` and scan the terminal QR code with your WhatsApp app.',
      'Import the included `whatsapp_ai_leadgen_workflow.json` into your n8n workspace.',
      'Configure your Gemini or OpenAI API key in the credentials manager and activate the workflow!',
    ],
    includedFiles: [
      {
        name: 'whatsapp-ai-leadgen-service.zip',
        type: 'TypeScript Microservice',
        size: '6.2 MB',
        description: 'Complete Node.js TypeScript webhook server, Baileys bridge, and intent router.',
      },
      {
        name: 'whatsapp_ai_leadgen_workflow.json',
        type: 'n8n Workflow',
        size: '160 KB',
        description: 'n8n AI agent workflow for conversation parsing, qualification, and CRM sync.',
      },
      {
        name: 'whatsapp_cloud_api_handler.ts',
        type: 'TypeScript Code',
        size: '52 KB',
        description: 'Webhook signature verification and WhatsApp interactive message formatter.',
      },
      {
        name: 'WHATSAPP_AI_SETUP_MANUAL.md',
        type: 'Setup Documentation',
        size: '48 KB',
        description: 'Complete setup manual covering Meta verification and anti-spam protocols.',
      },
    ],
  },
  {
    id: 'product-solana-sniper-bot',
    title: 'Solana Token Sniper & Tracker Bot Kit',
    category: 'web3',
    tagline: 'Ultra-Low Latency Mempool Sniper, Pump.fun Launch Tracker & Rug-Check Engine',
    version: 'v4.0.0 (Jito MEV Bundles + Yellowstone gRPC)',
    fileSize: '8.2 MB (ZIP Archive)',
    formats: ['TypeScript', 'Jito MEV Bundles', 'Yellowstone gRPC', 'Solana WebSockets'],
    badge: '🚀 Trending · Hot Alpha',
    tierRequired: 'all_paid',
    description:
      'High-speed Solana token sniper and liquidity launch monitor. Features sub-millisecond mempool detection for new Raydium CPMM pools, Pump.fun bonding curves, and Meteora DLMM launches with automated safety rug-checks, honeypot filters, and Jito MEV bundle tip execution.',
    highlights: [
      'Ultra-low latency detection via Yellowstone gRPC (Geyser plugin) and Helius WebSocket listeners',
      'Automated instant sniper module with custom slippage, priority fee ramping, and Jito bundle tips',
      'Automated Rug-Check Security Filter: Inspects mint authority, freeze authority, and LP token burn status',
      'Smart money & copy-trading tracker monitoring top whale wallet buy entries and exits',
      'Pump.fun bonding curve sniper with auto-sell profit target (% ROI) and stop-loss triggers',
      'CLI terminal dashboard with real-time ASCII charts, price telemetry, and audio transaction chimes',
    ],
    setupGuideSteps: [
      'Extract the source code ZIP and run `npm install`.',
      'Configure `.env` with your private key (Base58 string), Solana RPC endpoint, and Jito Block Engine URL.',
      'Customize your buy configuration in `config.json` (SOL per snipe, max slippage %, minimum liquidity).',
      'Enable rug-check parameters (`check_mint_renounced: true`, `check_lp_burned: true`).',
      'Run `npm run start:sniper` to begin real-time mempool scanning and automated execution!',
    ],
    includedFiles: [
      {
        name: 'solana-sniper-tracker-source.zip',
        type: 'Full Bot Source',
        size: '7.6 MB',
        description: 'Complete TypeScript bot project with Jito MEV integration, Raydium & Pump.fun parsers.',
      },
      {
        name: 'pumpfun_sniper_engine.ts',
        type: 'TypeScript Code',
        size: '68 KB',
        description: 'Specialized sub-second Pump.fun bonding curve sniper module.',
      },
      {
        name: 'rugcheck_safety_verifier.ts',
        type: 'Security Engine',
        size: '44 KB',
        description: 'On-chain token safety analyzer inspecting mint/freeze authorities & LP burn.',
      },
      {
        name: 'SOLANA_SNIPER_DEPLOY_GUIDE.md',
        type: 'Setup Documentation',
        size: '54 KB',
        description: 'Ultra-low latency optimization guide, dedicated RPC setup, and Jito tip calculation.',
      },
    ],
  },
  {
    id: 'product-n8n-workflows',
    title: 'Advanced n8n AI Agent Workflows Pack',
    category: 'n8n',
    tagline: 'Production-Ready Visual Automation & Multi-Agent Pipelines',
    version: 'v3.5.0 (n8n v1.75+ Ready)',
    fileSize: '5.2 MB (JSON + Guides)',
    formats: ['n8n JSON Workflows', 'Markdown Guides', 'Docker Compose'],
    badge: 'Ready to Import',
    tierRequired: 'all_paid',
    description:
      'Complete collection of turnkey n8n automation blueprints with autonomous multi-agent reasoning, automated SEO content creation, intelligent Telegram support bots, and multi-channel lead enrichment pipelines with webhook routing.',
    highlights: [
      'Automated Multi-Platform AI Content Generation pipeline (Twitter/X, LinkedIn, Substack, Telegram)',
      'Autonomous Telegram AI Support & Moderation Bot with contextual memory and tool-calling nodes',
      'High-conversion Lead Magnet & CRM Enrichment pipeline (Webhook -> AI Scraper -> Airtable/Notion/HubSpot)',
      'Native integration with Google Gemini 2.5/Flash, OpenAI GPT-4o, Claude 3.5, and DeepSeek models',
      'Pre-configured error retry handlers, rate-limiting queues, and alert notifications via Discord/Telegram',
      'One-click Importable JSON files plus self-hosted Docker-Compose n8n setup template',
    ],
    setupGuideSteps: [
      'Download the JSON workflow file (or full ZIP archive) below.',
      'Open your self-hosted n8n instance (or n8n Cloud dashboard).',
      'Click the top-right menu icon (...) -> "Import from File" and select the downloaded .json workflow.',
      'Configure your LLM API Keys (Gemini, OpenAI, or Claude) in the n8n Credentials Manager.',
      'Set your Webhook Trigger URL or connect your Telegram Bot Token from @BotFather.',
      'Activate the workflow and start executing real-time automations!',
    ],
    includedFiles: [
      {
        name: 'n8n_ai_content_engine_workflow.json',
        type: 'n8n Workflow',
        size: '145 KB',
        description: 'Autonomous multi-stage workflow researching trending market topics and generating formatted long-form & social posts.',
      },
      {
        name: 'n8n_telegram_ai_agent_workflow.json',
        type: 'n8n Workflow',
        size: '180 KB',
        description: 'Two-way interactive Telegram bot workflow with memory vector stores, intent routing, and dynamic response generation.',
      },
      {
        name: 'n8n_lead_crm_enrichment_workflow.json',
        type: 'n8n Workflow',
        size: '120 KB',
        description: 'Inbound webhook receiver that analyzes email/company domains, synthesizes customer dossiers, and syncs to database.',
      },
      {
        name: 'n8n_docker_compose_quickstart.yml',
        type: 'Docker Config',
        size: '4 KB',
        description: 'Production-ready self-hosted n8n deployment with PostgreSQL database and SSL proxy config.',
      },
      {
        name: 'N8N_IMPORT_SETUP_GUIDE.md',
        type: 'Setup Documentation',
        size: '42 KB',
        description: 'Complete walkthrough with environment variables, credential setup, and testing commands.',
      },
    ],
  },
  {
    id: 'product-webhook-boilerplates',
    title: 'Webhook & API Integration Boilerplates',
    category: 'dev',
    tagline: 'High-Throughput Backend Microservices (Node.js & Python)',
    version: 'v2.4.0',
    fileSize: '6.8 MB (ZIP)',
    formats: ['TypeScript (Express)', 'Python (FastAPI)', 'Docker'],
    badge: 'Dual Language Stack',
    tierRequired: 'all_paid',
    description:
      'Robust, secure, and production-tested webhook receivers and event dispatching backends. Includes cryptographic HMAC signature verification, Redis/BullMQ task retry queues, rate limiters, and dead-letter loggers.',
    highlights: [
      'TypeScript Express & Python FastAPI dual implementations with identical contract interfaces',
      'Cryptographic HMAC SHA-256 webhook signature validation (Stripe, GitHub, Helius, Alchemy, Shopify)',
      'Asynchronous task queuing with Redis / In-Memory worker fallback and exponential backoff retry',
      'Structured JSON logging with request ID tracing and telemetry headers',
      'Zero-downtime Docker container definitions with health-check endpoints and multi-stage builds',
      'Comprehensive Jest & Pytest test suites simulating high concurrency and malformed payloads',
    ],
    setupGuideSteps: [
      'Extract the ZIP archive to your local development workspace.',
      'Copy .env.example to .env and configure your secret HMAC signing keys and database connection.',
      'Run `npm install && npm run dev` (for Node.js) or `pip install -r requirements.txt && uvicorn main:app` (for Python).',
      'Use the included ngrok/localtunnel script `npm run tunnel` to test incoming live webhooks locally.',
      'Deploy to Cloud Run, Docker, VPS, or AWS ECS with the included production Dockerfiles.',
    ],
    includedFiles: [
      {
        name: 'nodejs-ts-webhook-engine.zip',
        type: 'TypeScript Project',
        size: '3.4 MB',
        description: 'Node.js 22 + Express + TypeScript webhook receiver with BullMQ queuing & HMAC validation.',
      },
      {
        name: 'python-fastapi-webhook-engine.zip',
        type: 'Python Project',
        size: '3.2 MB',
        description: 'Python 3.12 FastAPI async webhook engine with Pydantic v2 validation & Celery workers.',
      },
      {
        name: 'webhook_security_best_practices.md',
        type: 'Security Blueprint',
        size: '28 KB',
        description: 'Architecture reference for replay-attack prevention, idempotency keys, and payload sanitization.',
      },
    ],
  },
  {
    id: 'product-solana-buybot',
    title: 'Solana Telegram Buy-Bot Source Code',
    category: 'web3',
    tagline: 'Real-Time DEX Swap Monitor & Community Broadcast Engine',
    version: 'v3.1.0 (Raydium, Pump.fun, Meteora)',
    fileSize: '7.4 MB (ZIP)',
    formats: ['Node.js (TypeScript)', 'Solana WebSocket', 'Telegram Bot API'],
    badge: 'Production Bot Stack',
    tierRequired: 'all_paid',
    description:
      'Full open-source Telegram Buy-Bot engineered for Solana token communities. Features sub-second WebSocket transaction parsing across Raydium AMM, Pump.fun bonding curves, and Meteora DLMM with custom SVG/PNG image rendering.',
    highlights: [
      'Sub-second transaction streaming via Helius/QuickNode/Solana RPC WebSockets',
      'Decoders for Raydium V4/CPMM, Pump.fun bonding curve buys, and Meteora pools',
      'Automated buy step emoji visualizer (🟢🟢🟢) scaled proportionally to SOL buy volume',
      'Dynamic SVG/Canvas banner generator rendering market cap, holder counts, and buy metrics',
      'Spam-resistant Telegram message dispatching with rate-limit queue management',
      'Admin command suite: `/setthreshold`, `/setmedia`, `/tokeninfo`, `/holderstats`',
    ],
    setupGuideSteps: [
      'Unzip the source repository and install dependencies with `npm install`.',
      'Create a Telegram bot via @BotFather and retrieve your BOT_TOKEN.',
      'Configure your Solana RPC WebSocket URL (e.g. Helius, QuickNode, or public RPC) in `.env`.',
      'Set your target Token Mint Address and minimum buy threshold in SOL.',
      'Add the bot as an administrator with posting permissions to your Telegram community group.',
      'Run `npm run start` (or use PM2 / Docker) to begin broadcasting instant live buy alerts!',
    ],
    includedFiles: [
      {
        name: 'solana-telegram-buybot-source.zip',
        type: 'Full Bot Source',
        size: '7.1 MB',
        description: 'Complete TypeScript bot project with RPC listener, transaction parser, and Telegram engine.',
      },
      {
        name: 'dex_transaction_parsers.ts',
        type: 'TypeScript Code',
        size: '56 KB',
        description: 'Specialized Raydium, Pump.fun, and Meteora transaction instruction decoding module.',
      },
      {
        name: 'telegram_bot_setup_manual.md',
        type: 'Setup Manual',
        size: '35 KB',
        description: 'Step-by-step deployment guide for VPS, Railway, Render, or Docker.',
      },
    ],
  },
  {
    id: 'product-prompt-vault',
    title: 'The Ultimate AI & Web3 Prompt Vault',
    category: 'ai',
    tagline: '1,500+ Curated Reasoning & System Directives',
    version: 'v4.2.0 (Updated 2026)',
    fileSize: '4.8 MB',
    formats: ['JSON', 'Markdown', 'YAML'],
    badge: '1,500+ Prompts Included',
    tierRequired: 'all_paid',
    description:
      'Master collection of structured multi-agent reasoning chains, Solana protocol security auditors, tokenomics modeling frameworks, and DeFi autonomous agent directives in both clean JSON and ready-to-use Markdown formats.',
    highlights: [
      '1,500+ Production-tested prompt templates & few-shot examples',
      'Multi-Agent orchestration chains (Auditor, Architect, Quant, Strategist)',
      'Solana Smart Contract vulnerability & reentrancy attack scanners',
      'Tokenomics simulation & bonding curve mathematical formulas',
      'High-throughput social agent & community sentiment analyzer instructions',
      'Instant raw JSON schema importable into LangChain, LlamaIndex, & Gemini SDK',
    ],
    setupGuideSteps: [
      'Download the JSON database or Markdown playbook below.',
      'For LLM web apps (ChatGPT, Claude, Gemini): Copy system prompts directly from the Markdown guide.',
      'For programmatic AI pipelines: Import the structured JSON dataset directly into your agent runtime or vector database.',
    ],
    includedFiles: [
      {
        name: 'solpump_prompt_vault_complete.json',
        type: 'JSON Data',
        size: '2.4 MB',
        description: 'Complete structured prompt database with categories, variables, tags, and system prompts.',
      },
      {
        name: 'prompt_vault_playbook.md',
        type: 'Markdown Guide',
        size: '1.8 MB',
        description: 'Human-readable markdown documentation with copy-paste prompts & execution workflows.',
      },
      {
        name: 'agent_system_prompts.yaml',
        type: 'YAML Config',
        size: '620 KB',
        description: 'Autonomous agent persona specifications and tool execution parameters.',
      },
    ],
  },
  {
    id: 'product-react-boilerplate',
    title: 'React 19 & Tailwind CSS Developer Boilerplate Code',
    category: 'dev',
    tagline: 'Production-Ready Web3 SaaS Architecture',
    version: 'v3.0.1 (React 19 + Vite 6)',
    fileSize: '14.2 MB (ZIP)',
    formats: ['ZIP Archive', 'TypeScript', 'Tailwind v4'],
    badge: 'Full Source Code',
    tierRequired: 'all_paid',
    description:
      'Turnkey commercial starter kit built with React 19, TypeScript, Tailwind CSS v4, Lucide Icons, and @solana/web3.js. Includes pre-wired wallet connection adapters, non-custodial checkout flows, dark luxury UI primitives, and responsive layout foundations.',
    highlights: [
      'Full TypeScript codebase with strict type safety and zero compiler warnings',
      'Pre-configured Solana wallet connection suite (Phantom, Solflare, Backpack)',
      'Tailwind CSS v4 modern utility system with custom cyber-luxury color palette',
      'Reusable UI components: Modals, Ticker ribbons, Stat grids, Form validators',
      'Vite 6 build configuration optimized for sub-second hot reload and fast builds',
      'Complete commercial license for unlimited personal and client projects',
    ],
    setupGuideSteps: [
      'Extract the ZIP file and run `npm install` in the root directory.',
      'Start local development with `npm run dev` (runs on http://localhost:3000).',
      'Customize branding, colors, and receiving wallet address in `src/utils/solanaPayment.ts`.',
      'Build for production with `npm run build` to generate static assets in `dist/`.',
    ],
    includedFiles: [
      {
        name: 'solpump-react19-boilerplate.zip',
        type: 'ZIP Bundle',
        size: '14.2 MB',
        description: 'Complete project root containing package.json, src/, public/, configs, and README.',
      },
      {
        name: 'wallet-integration-hooks.ts',
        type: 'TypeScript File',
        size: '48 KB',
        description: 'Custom React hooks for Solana wallet detection, balance sync, and payment transfers.',
      },
      {
        name: 'tailwind-theme-preset.json',
        type: 'Design Token Config',
        size: '12 KB',
        description: 'Color palettes, font pairings, glassmorphism styles, and animation keyframes.',
      },
    ],
  },
  {
    id: 'product-solana-toolkit',
    title: 'Solana Smart Contract & Token Launch Toolkit',
    category: 'web3',
    tagline: 'Anchor 0.30, Token-2022 & Liquidity Launchpad',
    version: 'v2.8.0',
    fileSize: '8.6 MB (ZIP)',
    formats: ['Rust (.rs)', 'TypeScript CLI', 'Anchor Framework'],
    badge: 'Smart Contracts + Scripts',
    tierRequired: 'all_paid',
    description:
      'Enterprise-grade Solana development kit containing battle-tested Anchor programs, Token-2022 Transfer Hook extensions, Raydium/Orca liquidity pool initializer scripts, and automated vanity address generation tools.',
    highlights: [
      'Anchor Framework 0.30 smart contracts with security checks and unit tests',
      'SPL Token-2022 program templates with transfer fee and confidential transfer hooks',
      'Automated Liquidity Pool (LP) creation & token burning bash/TS scripts',
      'Solana Vanity Public Key grinder (multithreaded pattern search)',
      'Metaplex Core & On-chain Token Metadata inscription scripts',
      'Comprehensive smart contract audit checklist and common exploit test suite',
    ],
    setupGuideSteps: [
      'Install the Solana CLI and Anchor version 0.30+ (`cargo install --git https://github.com/coral-xyz/anchor anchor-cli`).',
      'Extract the toolkit ZIP and run `anchor build` to compile the Rust programs.',
      'Execute `anchor test` to run localnet security checks and transaction tests.',
      'Use the TypeScript scripts in `/scripts` to automate Token-2022 deployment and LP initialization.',
    ],
    includedFiles: [
      {
        name: 'solpump-anchor-toolkit.zip',
        type: 'ZIP Archive',
        size: '8.6 MB',
        description: 'Rust Anchor workspace with /programs, /tests, anchor.toml, and deploy scripts.',
      },
      {
        name: 'token2022_transfer_hook.rs',
        type: 'Rust Source',
        size: '34 KB',
        description: 'Production SPL Token-2022 transfer hook program with custom tax & royalty logic.',
      },
      {
        name: 'launch_liquidity_pool.ts',
        type: 'CLI Automation Script',
        size: '28 KB',
        description: 'One-command AMM liquidity pool initialization and LP token lock script.',
      },
      {
        name: 'solana_audit_checklist.md',
        type: 'Security Audit Guide',
        size: '95 KB',
        description: '35-point security verification checklist before launching to Solana Mainnet.',
      },
    ],
  },
];

