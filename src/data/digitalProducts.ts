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
