// High-resolution Unsplash CDN images mapped by specific financial, tech, and crypto topics
export const TOPIC_IMAGE_POOLS: Record<string, string[]> = {
  bitcoin: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=1200&q=80',
  ],
  ethereum: [
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
  ],
  solana: [
    'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
  ],
  crypto: [
    'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=1200&q=80',
  ],
  ai: [
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  ],
  fed: [
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  ],
  stocks: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
  ],
  energy: [
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
  ],
  gold: [
    'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1200&q=80',
  ],
  markets: [
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=1200&q=80',
  ],
};

function hashString(str: string): number {
  let hash = 0;
  if (!str) return 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministically resolve a relevant high-res article image based on topic keywords and category
 */
export function getDeterministicArticleImage(
  title: string = '',
  summary: string = '',
  category: string = 'markets',
  id: string = ''
): string {
  const text = `${title} ${summary}`.toLowerCase();

  let poolKey = 'markets';
  if (text.includes('bitcoin') || /\bbtc\b/i.test(text)) {
    poolKey = 'bitcoin';
  } else if (text.includes('ethereum') || /\beth\b/i.test(text)) {
    poolKey = 'ethereum';
  } else if (text.includes('solana') || /\bsol\b/i.test(text)) {
    poolKey = 'solana';
  } else if (
    category === 'crypto' ||
    text.includes('crypto') ||
    text.includes('blockchain') ||
    text.includes('binance') ||
    text.includes('coinbase') ||
    text.includes('stablecoin') ||
    text.includes('altcoin') ||
    text.includes('nft')
  ) {
    poolKey = 'crypto';
  } else if (
    text.includes('fed ') ||
    text.includes('federal reserve') ||
    text.includes('inflation') ||
    /\bcpi\b/i.test(text) ||
    text.includes('interest rate') ||
    text.includes('powell') ||
    text.includes('treasury') ||
    category === 'economy'
  ) {
    poolKey = 'fed';
  } else if (
    /\bai\b/i.test(text) ||
    text.includes('nvidia') ||
    text.includes('semiconductor') ||
    /\bchip\b/i.test(text) ||
    /\bchips\b/i.test(text) ||
    text.includes('artificial intelligence') ||
    text.includes('openai')
  ) {
    poolKey = 'ai';
  } else if (text.includes('gold') || text.includes('silver') || text.includes('bullion')) {
    poolKey = 'gold';
  } else if (
    /\boil\b/i.test(text) ||
    text.includes('crude') ||
    text.includes('energy') ||
    text.includes('gasoline') ||
    text.includes('opec') ||
    category === 'energy'
  ) {
    poolKey = 'energy';
  } else if (
    category === 'stocks' ||
    text.includes('stock') ||
    text.includes('s&p') ||
    text.includes('dow jones') ||
    text.includes('nasdaq') ||
    text.includes('earnings') ||
    text.includes('dividend') ||
    text.includes('shares')
  ) {
    poolKey = 'stocks';
  } else if (category === 'technology') {
    poolKey = 'technology';
  }

  const pool = TOPIC_IMAGE_POOLS[poolKey] || TOPIC_IMAGE_POOLS.markets;
  const index = hashString(id || title || 'pulse') % pool.length;
  return pool[index];
}
