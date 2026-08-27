import { DEVELOPER_SCRIPTS } from './developerScripts';
import { DIGITAL_PRODUCTS } from './digitalProducts';
import { FEATURED_TOOLS } from './toolsData';

export type SearchCategory = 'all' | 'scripts' | 'tools' | 'docs' | 'vault';

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'scripts' | 'tools' | 'docs' | 'vault';
  categoryLabel: string;
  tagline: string;
  badge: string;
  badgeColor: 'emerald' | 'cyan' | 'purple' | 'indigo' | 'amber';
  sectionId: string;
  tags: string[];
  meta?: string;
  codeSnippet?: string;
  actionText: string;
}

export const SEARCH_INDEX: SearchResultItem[] = [
  // 1. Developer Scripts Vault
  ...DEVELOPER_SCRIPTS.map((script) => ({
    id: `script-${script.id}`,
    title: script.title,
    category: 'scripts' as const,
    categoryLabel: 'Developer Script',
    tagline: script.tagline || script.description.slice(0, 90) + '...',
    badge: script.languageLabel,
    badgeColor: (script.language === 'python'
      ? 'emerald'
      : script.language === 'nodejs'
      ? 'cyan'
      : 'purple') as 'emerald' | 'cyan' | 'purple',
    sectionId: 'developer-scripts',
    tags: [
      'script',
      script.language,
      script.category,
      ...script.techBadges,
      script.codeFilename,
      'cli',
      'automation',
      'source code',
    ],
    meta: script.version,
    codeSnippet: script.cliExample,
    actionText: 'View Script Source',
  })),

  // 2. Interactive Tools & Calculators
  {
    id: 'tool-gas-calculator',
    title: 'Solana Priority Fee & Gas Cost Estimator',
    category: 'tools' as const,
    categoryLabel: 'Interactive Tool',
    tagline: 'Real-time compute unit pricing, priority fee multiplier, and lamport-to-USD calculator',
    badge: '⚡ Real-time Web3 Tool',
    badgeColor: 'emerald' as const,
    sectionId: 'gas-calculator',
    tags: ['solana', 'gas', 'fee', 'calculator', 'estimator', 'lamports', 'priority fee', 'compute units', 'cu'],
    meta: '100% Free Live Utility',
    actionText: 'Launch Estimator',
  },
  ...FEATURED_TOOLS.map((tool) => ({
    id: `tool-${tool.id}`,
    title: tool.title,
    category: 'tools' as const,
    categoryLabel: 'Interactive Tool',
    tagline: tool.description,
    badge: tool.categoryLabel,
    badgeColor: (tool.category === 'ai'
      ? 'emerald'
      : tool.category === 'dev'
      ? 'indigo'
      : 'purple') as 'emerald' | 'indigo' | 'purple',
    sectionId: 'utility-tools',
    tags: ['tool', tool.category, ...tool.tags, ...tool.features],
    meta: tool.version,
    actionText: 'Open Micro-Tool',
  })),

  // 3. Documentation & API Endpoints
  {
    id: 'doc-quickstart',
    title: 'Developer Quick Start Guide & Setup',
    category: 'docs' as const,
    categoryLabel: 'Documentation',
    tagline: 'Step-by-step instructions for running SolPump scripts, local testing, and node connections.',
    badge: 'Docs Guide',
    badgeColor: 'cyan' as const,
    sectionId: 'dev-docs',
    tags: ['docs', 'quickstart', 'guide', 'installation', 'python', 'nodejs', 'setup', 'env'],
    meta: 'Official Documentation',
    actionText: 'Read Quickstart',
  },
  {
    id: 'doc-api-tools',
    title: 'REST API: Fetch Micro-Tools Directory (GET /api/v1/tools)',
    category: 'docs' as const,
    categoryLabel: 'API Endpoint',
    tagline: 'Returns the catalog of client-side micro-tools, categories (AI, Web3, Dev), versioning, and download checksums.',
    badge: 'GET /api/v1/tools',
    badgeColor: 'emerald' as const,
    sectionId: 'dev-docs',
    tags: ['api', 'rest', 'endpoint', 'tools', 'catalog', 'json', 'get', 'v1'],
    meta: 'Public Endpoint • No Auth',
    codeSnippet: 'curl -X GET https://sol-pump.store/api/v1/tools',
    actionText: 'Test API Endpoint',
  },
  {
    id: 'doc-api-token',
    title: 'REST API: Live $sopump Price & Liquidity (GET /api/v1/token/sopump)',
    category: 'docs' as const,
    categoryLabel: 'API Endpoint',
    tagline: 'Real-time indexed metrics for $sopump Jetton on TON mainnet, including price, market cap, and pool reserves.',
    badge: 'GET /api/v1/token/sopump',
    badgeColor: 'cyan' as const,
    sectionId: 'dev-docs',
    tags: ['api', 'token', 'price', 'sopump', 'ton', 'dedust', 'liquidity', 'market cap'],
    meta: 'Public Endpoint • No Auth',
    codeSnippet: 'curl -X GET https://sol-pump.store/api/v1/token/sopump',
    actionText: 'Test API Endpoint',
  },
  {
    id: 'doc-api-rates',
    title: 'REST API: Solana Gas & Priority Fee Rates (GET /api/v1/rates/solana)',
    category: 'docs' as const,
    categoryLabel: 'API Endpoint',
    tagline: 'Provides current priority fee percentiles (low, medium, high, extreme) and SOL/USD exchange rates.',
    badge: 'GET /api/v1/rates/solana',
    badgeColor: 'purple' as const,
    sectionId: 'dev-docs',
    tags: ['api', 'rates', 'solana', 'priority fee', 'gas', 'micro-lamports', 'exchange rate'],
    meta: 'Public Endpoint • No Auth',
    codeSnippet: 'curl -X GET https://sol-pump.store/api/v1/rates/solana',
    actionText: 'Test API Endpoint',
  },
  {
    id: 'doc-api-license',
    title: 'REST API: Verify Cryptographic License Key (POST /api/v1/license/verify)',
    category: 'docs' as const,
    categoryLabel: 'API Endpoint',
    tagline: 'Validates Pro or Enterprise license keys, checking signature hashes, expiration, and active tier permissions.',
    badge: 'POST /api/v1/license/verify',
    badgeColor: 'amber' as const,
    sectionId: 'dev-docs',
    tags: ['api', 'license', 'verify', 'post', 'auth', 'pro', 'enterprise', 'signature'],
    meta: 'Bearer Auth Required',
    codeSnippet: 'curl -X POST https://sol-pump.store/api/v1/license/verify',
    actionText: 'Test API Endpoint',
  },
  {
    id: 'doc-sdk',
    title: 'SolPump TypeScript & Python Client SDKs',
    category: 'docs' as const,
    categoryLabel: 'Documentation',
    tagline: 'Lightweight, type-safe client libraries for seamless integration into your bot infrastructure and microservices.',
    badge: 'SDK & Client',
    badgeColor: 'indigo' as const,
    sectionId: 'dev-docs',
    tags: ['sdk', 'typescript', 'python', 'client', 'npm', 'pip', 'integration'],
    meta: '@solpump/client v2.4.0',
    actionText: 'View SDK Docs',
  },
  {
    id: 'doc-architecture',
    title: 'High-Speed Web3 Microservices Architecture',
    category: 'docs' as const,
    categoryLabel: 'Documentation',
    tagline: 'Comprehensive architectural blueprint outlining our sub-10ms response times, non-custodial design, and TON/Solana integration.',
    badge: 'Architecture',
    badgeColor: 'purple' as const,
    sectionId: 'dev-docs',
    tags: ['architecture', 'microservices', 'infra', 'performance', 'non-custodial', 'security'],
    meta: 'System Design Spec',
    actionText: 'View Architecture',
  },
  {
    id: 'doc-audit-security',
    title: 'Smart Contract Audit & Decentralized Legal Disclosures',
    category: 'docs' as const,
    categoryLabel: 'Trust & Legal',
    tagline: 'TEP-74 TON smart contract audit confirmation, non-custodial privacy guarantees, and open-source terms.',
    badge: 'Audit Verified',
    badgeColor: 'emerald' as const,
    sectionId: 'trust-legal-hub',
    tags: ['audit', 'security', 'legal', 'trust', 'contract', 'ton', 'tep-74', 'non-custodial', 'privacy'],
    meta: 'Verified On-Chain',
    actionText: 'Inspect Legal Hub',
  },

  // 4. Digital Vault & High-Value Products
  ...DIGITAL_PRODUCTS.map((prod) => ({
    id: `vault-${prod.id}`,
    title: prod.title,
    category: 'vault' as const,
    categoryLabel: 'Vault Package',
    tagline: prod.tagline || prod.description.slice(0, 90) + '...',
    badge: prod.badge || prod.category.toUpperCase(),
    badgeColor: (prod.category === 'web3'
      ? 'purple'
      : prod.category === 'ai'
      ? 'emerald'
      : 'cyan') as 'purple' | 'emerald' | 'cyan',
    sectionId: 'vault',
    tags: ['vault', 'download', 'zip', prod.category, ...prod.formats, ...prod.highlights],
    meta: `${prod.fileSize} • 100% Free ZIP`,
    actionText: 'Open in Vault',
  })),

  // 5. Ecosystem Hubs
  {
    id: 'hub-backers',
    title: 'Backers & $sopump Token Utility Hub',
    category: 'vault' as const,
    categoryLabel: 'Ecosystem Hub',
    tagline: 'Explore tokenomics, DEX liquidity pools on DeDust, staking mechanics, and backer privileges.',
    badge: 'Token Ecosystem',
    badgeColor: 'cyan' as const,
    sectionId: 'backers-hub',
    tags: ['token', 'sopump', 'backers', 'ton', 'dedust', 'liquidity', 'utility', 'airdrop'],
    meta: 'TON Mainnet Jetton',
    actionText: 'Open Backers Hub',
  },
  {
    id: 'hub-investors',
    title: 'Investors, IP Acquisition & Strategic Asset Hub',
    category: 'vault' as const,
    categoryLabel: 'Ecosystem Hub',
    tagline: 'Institutional IP licensing, proprietary codebase valuation, and direct strategic partnership contact.',
    badge: 'Institutional & IP',
    badgeColor: 'purple' as const,
    sectionId: 'investors-hub',
    tags: ['investors', 'ip', 'acquisition', 'licensing', 'commercial', 'institutional', 'valuation'],
    meta: 'Enterprise IP Asset',
    actionText: 'Open Investors Hub',
  },
  {
    id: 'hub-pricing',
    title: 'Pro & Enterprise Lifetime Licensing Store',
    category: 'vault' as const,
    categoryLabel: 'Pricing Store',
    tagline: 'Compare Community Free, Pro Developer ($49), and Enterprise IP ($299) licenses with multi-crypto checkout.',
    badge: 'Pricing & Pro',
    badgeColor: 'cyan' as const,
    sectionId: 'store',
    tags: ['pricing', 'pro', 'enterprise', 'store', 'license', 'crypto payment', 'ton', 'sol', 'sopump'],
    meta: 'Instant Web3 Checkout',
    actionText: 'View Pricing Plans',
  },
];
