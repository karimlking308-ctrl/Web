export interface ToolItem {
  id: string;
  title: string;
  category: 'ai' | 'dev' | 'web3';
  categoryLabel: string;
  badge: string;
  description: string;
  features: string[];
  pricing: string;
  popularity: string;
  version: string;
  tags: string[];
}

export const CATEGORIES = [
  {
    id: 'ai-prompt-vault',
    name: 'AI Prompt Vault',
    type: 'ai' as const,
    shortDesc: 'Curated system prompts, multimodal agent recipes, and LLM tuning templates engineered for maximum precision.',
    iconName: 'Sparkles',
    stats: '1,200+ Prompts',
    accentColor: 'emerald',
    featuredTools: [
      'Autonomous Agent System Prompts',
      'Reasoning Chain-of-Thought Blueprints',
      'Creative Copy & Marketing Synthesizers',
    ],
  },
  {
    id: 'dev-utilities',
    name: 'Developer Utilities',
    type: 'dev' as const,
    shortDesc: 'High-speed developer toolkits, API formatting proxies, JSON payload validators, and workflow automation helpers.',
    iconName: 'Code2',
    stats: '45+ Micro-Tools',
    accentColor: 'indigo',
    featuredTools: [
      'High-Throughput API Payload Formatter',
      'Environment Variable & Secret Obfuscator',
      'TypeScript Schema & Type Generator',
    ],
  },
  {
    id: 'web3-solutions',
    name: 'Web3 Solutions',
    type: 'web3' as const,
    shortDesc: 'Solana RPC endpoint switchers, transaction decoder utilities, wallet signature testers, and creator smart tools.',
    iconName: 'Cpu',
    stats: '24+ Web3 Modules',
    accentColor: 'purple',
    featuredTools: [
      'Solana Transaction Payload Decoder',
      'SPL Token Metadata Inspector',
      'Decentralized Storage Pinner Assistant',
    ],
  },
];

export const FEATURED_TOOLS: ToolItem[] = [
  {
    id: 'prompt-engine-v2',
    title: 'Multi-Agent Prompt Engine',
    category: 'ai',
    categoryLabel: 'AI Vault',
    badge: 'Popular',
    description: 'Structured meta-prompts with parameterized injection slots designed for reasoning models and multimodal vision tasks.',
    features: ['Token-optimized framing', 'JSON output schemas', 'Zero-shot to few-shot templates'],
    pricing: 'Free Tier Available',
    popularity: '98% Positive',
    version: 'v2.4.0',
    tags: ['GPT-4o', 'Claude 3.5', 'Gemini Pro', 'DeepSeek'],
  },
  {
    id: 'sol-tx-decoder',
    title: 'Solana Transaction Visualizer',
    category: 'web3',
    categoryLabel: 'Web3 Solutions',
    badge: 'Trending',
    description: 'Inspect raw Solana base58 instructions, account keys, compute unit consumptions, and inner instruction trees in real time.',
    features: ['Compute budget analyzer', 'Program ID mapping', 'Error logs decoder'],
    pricing: 'Open Source / Pro API',
    popularity: '99% Accuracy',
    version: 'v1.8.2',
    tags: ['Solana', 'RPC', 'Base58', 'Anchor'],
  },
  {
    id: 'api-secret-vault',
    title: 'API Payload & Secret Obfuscator',
    category: 'dev',
    categoryLabel: 'Developer Tools',
    badge: 'Verified',
    description: 'Client-side zero-knowledge sanitizer that strips sensitive tokens, private keys, and authorization headers before logging.',
    features: ['RegEx secret detector', 'Zero server persistence', 'Batch file export'],
    pricing: 'Free Utility',
    popularity: '10k+ Daily Runs',
    version: 'v3.1.0',
    tags: ['Security', 'CLI', 'WebAssembly', 'DevOps'],
  },
  {
    id: 'spl-token-builder',
    title: 'SPL Metadata Assistant',
    category: 'web3',
    categoryLabel: 'Web3 Solutions',
    badge: 'New',
    description: 'Validate Metaplex standards, generate decentralized JSON manifests, and verify URI hash proofs without boilerplate.',
    features: ['Metaplex v1/v2 support', 'IPFS URI generator', 'Attribute schema validator'],
    pricing: 'Community Free',
    popularity: '95% Rating',
    version: 'v1.2.0',
    tags: ['Metaplex', 'SPL', 'JSON-LD', 'IPFS'],
  },
  {
    id: 'ai-creative-director',
    title: 'Generative Art Concept Matrix',
    category: 'ai',
    categoryLabel: 'AI Vault',
    badge: 'Curated',
    description: 'Comprehensive prompt modifier database containing lighting, film stocks, camera parameters, and stylized aesthetics.',
    features: ['Midjourney v6 parameters', 'Negative prompt presets', 'Aspect ratio presets'],
    pricing: 'Free Access',
    popularity: '4.9/5 Rating',
    version: 'v4.0.1',
    tags: ['Midjourney', 'Stable Diffusion', 'FLUX', 'DALL-E 3'],
  },
  {
    id: 'ts-type-synthesizer',
    title: 'TypeScript Schema Synthesizer',
    category: 'dev',
    categoryLabel: 'Developer Tools',
    badge: 'Essential',
    description: 'Instantly convert nested JSON objects, GraphQL schemas, and SQL tables into strict, fully typed TypeScript interfaces.',
    features: ['Zod schema generation', 'Nullability guards', 'Nested type unrolling'],
    pricing: 'Free Utility',
    popularity: '99.9% Uptime',
    version: 'v2.6.4',
    tags: ['TypeScript', 'Zod', 'GraphQL', 'Interfaces'],
  },
];

export const PLATFORM_STATS = [
  { label: 'Active Creators & Devs', value: '42,000+' },
  { label: 'Curated AI Prompts', value: '1,500+' },
  { label: 'Micro-Tools Executed', value: '8.4M+' },
  { label: 'Platform Availability', value: '99.98%' },
];

export const FAQS = [
  {
    question: 'What is SolPump Store?',
    answer: 'SolPump Store (sol-pump.store) is a dedicated digital hub providing elite AI prompt architectures, developer micro-utilities, and Web3 creator solutions to accelerate modern development and content workflows.',
  },
  {
    question: 'Are all developer utilities client-side and secure?',
    answer: 'Yes. Our developer utilities operate with strict privacy standards—zero unauthorized logging and zero storage of your private keys or confidential tokens.',
  },
  {
    question: 'How do I access the digital store and tools?',
    answer: 'You can explore all free utilities directly from the catalog. For premium vaults and specialized developer API tokens, simply log in through the creator portal.',
  },
  {
    question: 'Can I integrate SolPump Store tools into my CI/CD or scripts?',
    answer: 'Yes! We provide documentation, standard JSON schema outputs, and CLI snippets for easy integration into automated pipelines.',
  },
];
