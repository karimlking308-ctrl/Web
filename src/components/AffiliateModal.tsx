import React, { useState, useEffect } from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  AffiliateAccount,
  getOrCreateAffiliateAccount,
  claimAffiliateEarnings,
  getActiveReferrer,
} from '../utils/affiliateStorage';

interface AffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userWalletAddress: string | null;
  onConnectWallet: () => void;
}

export const AffiliateModal: React.FC<AffiliateModalProps> = ({
  isOpen,
  onClose,
  userWalletAddress,
  onConnectWallet,
}) => {
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState<{ amount: number; txHash: string } | null>(null);
  const [account, setAccount] = useState<AffiliateAccount | null>(null);

  // Load affiliate account when wallet changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const activeWallet = userWalletAddress || 'SOL_CREATOR_DEMO_WALLET';
      const acc = getOrCreateAffiliateAccount(activeWallet);
      setAccount(acc);
      setClaimSuccess(null);
    }
  }, [isOpen, userWalletAddress]);

  if (!isOpen) return null;

  const activeWallet = userWalletAddress || 'DemoWallet1111111111111111111111111111';
  const referralLink = `${window.location.origin}/?ref=${encodeURIComponent(activeWallet)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaimRewards = () => {
    if (!account || account.unclaimedSol <= 0) return;
    setClaiming(true);

    setTimeout(() => {
      const result = claimAffiliateEarnings(account.walletAddress);
      if (result.success) {
        setClaimSuccess({ amount: result.claimedSol, txHash: result.txHash });
        setAccount(getOrCreateAffiliateAccount(account.walletAddress));
      }
      setClaiming(false);
    }, 1200);
  };

  const currentReferrer = getActiveReferrer();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Affiliate &amp; Referral Program
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono-code font-semibold text-emerald-400">
                  30% Commission
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-code">
                Earn instant SOL commissions on every referred checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {!userWalletAddress && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-amber-300">
                    Connect Solana Wallet for Custom Link
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    You are currently previewing with a demo wallet address. Connect your real Phantom or Solflare wallet to claim payouts.
                  </p>
                </div>
              </div>
              <button
                onClick={onConnectWallet}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shrink-0 cursor-pointer"
              >
                Connect
              </button>
            </div>
          )}

          {/* Unique Referral Link Box */}
          <div className="space-y-2">
            <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider">
              Your Unique Referral Link
            </label>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-transparent border-none outline-none text-xs text-emerald-400 font-mono-code px-2 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Share this link across Twitter, Telegram, Discord, or YouTube. When anyone purchases a Pro plan or Lifetime Bundle, 30% is credited directly to your account.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-mono-code uppercase">Clicks</span>
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono-code">
                {account?.totalClicks || 0}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Unique visits</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-mono-code uppercase">Sales</span>
                <Award className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono-code">
                {account?.totalConversions || 0}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Successful checkouts</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-mono-code uppercase">Total Earned</span>
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono-code">
                {account?.totalEarnedSol || '0.0000'} <span className="text-xs text-emerald-400 font-sans">SOL</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">${account?.totalEarnedUsd || '0.00'} USD</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-mono-code uppercase">Unclaimed</span>
                <Wallet className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono-code">
                {account?.unclaimedSol || '0.0000'} <span className="text-xs text-slate-300 font-sans">SOL</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Ready to withdraw</div>
            </div>
          </div>

          {/* Claim / Withdraw Action Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-xs font-semibold text-white">Instant On-Chain SOL Payouts</h4>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Withdraw your unclaimed balance directly to your connected Solana wallet instantly with zero platform fees.
              </p>
            </div>
            <button
              onClick={handleClaimRewards}
              disabled={claiming || !account || account.unclaimedSol <= 0}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                account && account.unclaimedSol > 0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {claiming ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Settling on Solana...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>Claim {account?.unclaimedSol || 0} SOL</span>
                </>
              )}
            </button>
          </div>

          {claimSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Successfully Withdrawn {claimSuccess.amount} SOL!</span>
                <p className="text-[11px] text-emerald-200/80 font-mono-code mt-0.5 break-all">
                  Tx: {claimSuccess.txHash}
                </p>
              </div>
            </div>
          )}

          {/* Referral History */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-slate-300">
              Referral Earnings Log ({account?.records?.length || 0})
            </h4>
            
            {account?.records && account.records.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {account.records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{rec.planName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-code">
                          ${rec.orderTotalUsd} USD
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-code">
                        {new Date(rec.timestamp).toLocaleString()} · Tx: {rec.txHash.slice(0, 10)}...
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-code font-bold text-emerald-400">
                        +{rec.commissionSol} SOL
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-code">
                        30% Commission
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 rounded-xl bg-slate-900/50 border border-slate-800/80 text-slate-400 text-xs">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>No referred checkouts recorded yet.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Share your link with crypto communities to start earning 30% commission instantly!
                </p>
              </div>
            )}
          </div>

          {currentReferrer && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Active Referrer in session:</span>
              <span className="font-mono-code text-cyan-400">{currentReferrer}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800/80 bg-slate-900/50 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono-code">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Instant Smart Contract Affiliate Attribution
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
