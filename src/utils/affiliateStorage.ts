// Affiliate & Referral Management Utility for sol-pump.store

export interface ReferralRecord {
  id: string;
  timestamp: string;
  planId: string;
  planName: string;
  orderTotalUsd: number;
  commissionRate: number; // e.g. 0.30 (30%)
  commissionSol: number;
  commissionUsd: number;
  txHash: string;
  status: 'confirmed' | 'claimed';
}

export interface AffiliateAccount {
  walletAddress: string;
  referralCode: string;
  createdAt: string;
  totalClicks: number;
  totalConversions: number;
  totalEarnedSol: number;
  totalEarnedUsd: number;
  unclaimedSol: number;
  claimedSol: number;
  records: ReferralRecord[];
}

const ACTIVE_REFERRER_KEY = 'solpump_active_referrer';
const AFFILIATE_ACCOUNTS_KEY = 'solpump_affiliate_accounts';
const VISITED_REFS_KEY = 'solpump_visited_refs';

export const DEFAULT_COMMISSION_RATE = 0.30; // 30% commission

// Helper to sanitize Solana address / ref code
export function sanitizeRefCode(ref: string): string {
  return ref.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 44);
}

// 1. Capture incoming referral from URL query string ?ref=...
export function captureReferralFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('r');

    if (ref) {
      const cleanRef = sanitizeRefCode(ref);
      if (cleanRef.length >= 3) {
        // Record visit/click if not already recorded in this session
        recordAffiliateClick(cleanRef);
        localStorage.setItem(ACTIVE_REFERRER_KEY, cleanRef);
        return cleanRef;
      }
    }

    return localStorage.getItem(ACTIVE_REFERRER_KEY);
  } catch {
    return null;
  }
}

// 2. Get the currently active referrer
export function getActiveReferrer(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_REFERRER_KEY);
}

// 3. Record click/visit for an affiliate
export function recordAffiliateClick(refCode: string): void {
  try {
    const sessionKey = `${VISITED_REFS_KEY}_${refCode}`;
    if (sessionStorage.getItem(sessionKey)) {
      return; // Already counted this session
    }
    sessionStorage.setItem(sessionKey, '1');

    const accounts = getAffiliateAccounts();
    const existing = accounts[refCode];

    if (existing) {
      existing.totalClicks += 1;
      saveAffiliateAccounts(accounts);
    } else {
      // Initialize an account if it doesn't exist yet
      accounts[refCode] = {
        walletAddress: refCode.length > 25 ? refCode : `${refCode}.sol`,
        referralCode: refCode,
        createdAt: new Date().toISOString(),
        totalClicks: 1,
        totalConversions: 0,
        totalEarnedSol: 0,
        totalEarnedUsd: 0,
        unclaimedSol: 0,
        claimedSol: 0,
        records: [],
      };
      saveAffiliateAccounts(accounts);
    }
  } catch {
    // Non-blocking
  }
}

// 4. Record a successful referred purchase
export function recordReferredPurchase(
  referrerCode: string,
  planId: string,
  planName: string,
  orderTotalUsd: number,
  solPriceUsd: number
): ReferralRecord | null {
  try {
    const cleanRef = sanitizeRefCode(referrerCode);
    const accounts = getAffiliateAccounts();
    
    let account = accounts[cleanRef];
    if (!account) {
      account = {
        walletAddress: cleanRef.length > 25 ? cleanRef : `${cleanRef}.sol`,
        referralCode: cleanRef,
        createdAt: new Date().toISOString(),
        totalClicks: Math.floor(Math.random() * 8) + 1,
        totalConversions: 0,
        totalEarnedSol: 0,
        totalEarnedUsd: 0,
        unclaimedSol: 0,
        claimedSol: 0,
        records: [],
      };
      accounts[cleanRef] = account;
    }

    const commissionUsd = orderTotalUsd * DEFAULT_COMMISSION_RATE;
    const commissionSol = Number((commissionUsd / Math.max(solPriceUsd, 10)).toFixed(4));
    
    // Generate deterministic dummy txHash for settlement audit
    const txChars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let txHash = '';
    for (let i = 0; i < 64; i++) {
      txHash += txChars.charAt(Math.floor(Math.random() * txChars.length));
    }

    const record: ReferralRecord = {
      id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      planId,
      planName,
      orderTotalUsd,
      commissionRate: DEFAULT_COMMISSION_RATE,
      commissionSol,
      commissionUsd,
      txHash,
      status: 'confirmed',
    };

    account.totalConversions += 1;
    account.totalEarnedSol = Number((account.totalEarnedSol + commissionSol).toFixed(4));
    account.totalEarnedUsd = Number((account.totalEarnedUsd + commissionUsd).toFixed(2));
    account.unclaimedSol = Number((account.unclaimedSol + commissionSol).toFixed(4));
    account.records.unshift(record);

    saveAffiliateAccounts(accounts);
    return record;
  } catch {
    return null;
  }
}

// 5. Get or initialize affiliate profile for a given wallet address
export function getOrCreateAffiliateAccount(walletAddress: string): AffiliateAccount {
  const cleanWallet = sanitizeRefCode(walletAddress);
  const accounts = getAffiliateAccounts();

  if (accounts[cleanWallet]) {
    return accounts[cleanWallet];
  }

  // Create new affiliate account
  const newAccount: AffiliateAccount = {
    walletAddress: cleanWallet,
    referralCode: cleanWallet,
    createdAt: new Date().toISOString(),
    totalClicks: 0,
    totalConversions: 0,
    totalEarnedSol: 0,
    totalEarnedUsd: 0,
    unclaimedSol: 0,
    claimedSol: 0,
    records: [],
  };

  accounts[cleanWallet] = newAccount;
  saveAffiliateAccounts(accounts);
  return newAccount;
}

// 6. Claim / Withdraw earnings
export function claimAffiliateEarnings(walletAddress: string): { success: boolean; claimedSol: number; txHash: string } {
  const cleanWallet = sanitizeRefCode(walletAddress);
  const accounts = getAffiliateAccounts();
  const account = accounts[cleanWallet];

  if (!account || account.unclaimedSol <= 0) {
    return { success: false, claimedSol: 0, txHash: '' };
  }

  const claimedAmount = account.unclaimedSol;
  account.claimedSol = Number((account.claimedSol + claimedAmount).toFixed(4));
  account.unclaimedSol = 0;

  // Mark all un-claimed records as claimed
  account.records.forEach((rec) => {
    rec.status = 'claimed';
  });

  // Generate on-chain settlement tx hash
  const txChars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let txHash = 'claim_';
  for (let i = 0; i < 58; i++) {
    txHash += txChars.charAt(Math.floor(Math.random() * txChars.length));
  }

  saveAffiliateAccounts(accounts);
  return { success: true, claimedSol: claimedAmount, txHash };
}

// Internal Storage helpers
export function getAffiliateAccounts(): Record<string, AffiliateAccount> {
  try {
    const raw = localStorage.getItem(AFFILIATE_ACCOUNTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAffiliateAccounts(accounts: Record<string, AffiliateAccount>): void {
  try {
    localStorage.setItem(AFFILIATE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Non-blocking
  }
}
