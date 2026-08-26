import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Lock,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Cpu,
  Download,
  Users,
  ExternalLink,
  ChevronRight,
  Globe,
  HelpCircle,
  X,
} from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocType;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalDocType>(initialDoc);

  // Sync initialDoc when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialDoc);
    }
  }, [isOpen, initialDoc]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      id="legal-modal-backdrop"
    >
      <div
        className="relative w-full max-w-3xl bg-[#0a0d16] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        id="legal-modal-container"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/90 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Legal &amp; Compliance Center
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono-code text-slate-300">
                  v2.4 · 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-code">
                SolPump Store (sol-pump.store) · Non-Custodial Web3 Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            id="close-legal-modal-btn"
            aria-label="Close Legal Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-800/60 bg-slate-900/30 shrink-0">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-code font-medium transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            id="tab-privacy-policy"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-code font-medium transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            id="tab-terms-of-service"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <div className="ml-auto text-[11px] font-mono-code text-slate-400 hidden sm:block">
            Last Updated: August 2026
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'privacy' ? (
            /* ================= PRIVACY POLICY ================= */
            <div className="space-y-6" id="privacy-policy-content">
              {/* Highlight summary card */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-300">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Privacy First: Non-Custodial &amp; Zero Personal Data Harvesting</span>
                </div>
                <p className="text-slate-300 leading-normal">
                  SolPump Store is built as an open, client-centric decentralized software repository. We do NOT maintain custodial accounts, passwords, or personal identity databases. All purchases are settled directly on the public Solana blockchain.
                </p>
              </div>

              {/* 1. Information Collected */}
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono-code">1</span>
                  Information We Process &amp; Collect
                </h4>
                <p className="text-slate-400">
                  Depending on how you interact with SolPump Store, we process the following limited technical data points:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2">
                  <li>
                    <strong className="text-slate-200">Public Solana Wallet Addresses:</strong> Used solely to verify on-chain settlement, sign non-custodial transactions, and generate automated affiliate commission routing.
                  </li>
                  <li>
                    <strong className="text-slate-200">Transaction Signatures (TxHash):</strong> Public on-chain cryptographic proofs confirming the receipt of SOL or USDC for instant digital vault unlocking.
                  </li>
                  <li>
                    <strong className="text-slate-200">Local Browser Storage:</strong> We use your browser's <code className="text-emerald-400 font-mono-code">localStorage</code> and <code className="text-emerald-400 font-mono-code">sessionStorage</code> to cache unlocked product licenses, affiliate referral attribution codes, and developer tool preferences locally on your machine.
                  </li>
                  <li>
                    <strong className="text-slate-200">Affiliate Referral Data:</strong> If you navigate to SolPump Store via a partner link (e.g. <code className="text-emerald-400 font-mono-code">?ref=WALLET</code>), your referral association is cached locally to credit the referrer upon successful digital goods purchase.
                  </li>
                </ul>
              </section>

              {/* 2. How Data is Used */}
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono-code">2</span>
                  How We Use Your Data
                </h4>
                <p className="text-slate-400">
                  Your data is used strictly for technical operation:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-semibold text-slate-200 text-xs mb-1 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      Digital Asset Delivery
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Generating digital license keys, unzipping script bundles, and delivering instant offline source code downloads.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-semibold text-slate-200 text-xs mb-1 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      Affiliate Settlement
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Calculating accurate 30% affiliate commissions and validating on-chain payout transactions.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Third-Party Web3 RPC Providers */}
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono-code">3</span>
                  Third-Party Web3 RPCs &amp; APIs
                </h4>
                <p className="text-slate-400">
                  To provide real-time token pricing, fee estimators, and transaction broadcasting, SolPump Store connects with decentralized public endpoints:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                  <li><strong>Solana Mainnet RPC Nodes:</strong> For querying ledger states and account balances.</li>
                  <li><strong>CoinGecko / Jupiter API:</strong> For real-time SOL/USD exchange rates without capturing personal data.</li>
                  <li><strong>External Socials:</strong> Outbound links to our Telegram, Twitter (X), and Facebook community channels operate under their respective privacy policies.</li>
                </ul>
              </section>

              {/* 4. Data Security & Storage */}
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono-code">4</span>
                  Cookies &amp; Local Storage Policy
                </h4>
                <p className="text-slate-400">
                  We do not use intrusive cross-site tracking cookies or third-party marketing pixels. All authorization tokens (such as your Pro license key) are stored strictly inside your browser's private local storage partition and are never transmitted to unauthorized parties.
                </p>
              </section>

              {/* 5. Contact & Inquiries */}
              <section className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-xs font-mono-code font-semibold text-slate-200 uppercase">
                  Data Protection Inquiries
                </h4>
                <p className="text-xs text-slate-400">
                  For questions regarding data processing or open-source verification, contact our developer team on Telegram <a href="https://t.me/solana_pump_platform" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">@solana_pump_platform</a> or via Twitter <a href="https://x.com/Platform_launch" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">@Platform_launch</a>.
                </p>
              </section>
            </div>
          ) : (
            /* ================= TERMS OF SERVICE ================= */
            <div className="space-y-6" id="terms-of-service-content">
              {/* Highlight summary card */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Important: Digital Goods, On-Chain Non-Refundable Sales &amp; Web3 Risks</span>
                </div>
                <p className="text-slate-300 leading-normal">
                  By accessing SolPump Store or executing an on-chain crypto checkout, you agree to these Terms. All digital source code, Telegram bot boilerplates, n8n workflows, and AI prompt vaults are delivered immediately upon confirmation and are non-refundable.
                </p>
              </div>

              {/* 1. Digital Goods & Non-Refundability */}
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono-code">1</span>
                  Digital Goods Delivery &amp; Irrevocable Sales
                </h4>
                <p className="text-slate-400">
                  SolPump Store sells digital software, developer toolkits, scripts, automation flows, and prompt databases.
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2">
                  <li>
                    <strong className="text-slate-200">Instant Automated Delivery:</strong> Upon on-chain transaction confirmation, your license key is generated and direct download access to digital files is unlocked immediately.
                  </li>
                  <li>
                    <strong className="text-slate-200">Non-Refundable On-Chain Transactions:</strong> Because on-chain cryptocurrency transactions (SOL / USDC) are irreversible and digital goods cannot be "returned" once downloaded, all purchases are final and non-refundable.
                  </li>
                </ul>
              </section>

              {/* 2. License Grant & Intellectual Property */}
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono-code">2</span>
                  Commercial &amp; Developer License Rights
                </h4>
                <p className="text-slate-400">
                  Purchasers of the Starter, Pro, or Lifetime Elite Bundles are granted a perpetual, royalty-free, worldwide license:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="text-emerald-400 font-semibold text-xs mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Permitted Uses
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      <li>• Deploy Telegram bots for commercial clients</li>
                      <li>• Integrate n8n workflows in private agencies</li>
                      <li>• Modify and build commercial Web3 dApps</li>
                      <li>• Unlimited personal and enterprise deployments</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                    <div className="text-rose-400 font-semibold text-xs mb-1 flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5" />
                      Restricted / Prohibited Uses
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      <li>• Reselling raw script files as competing templates</li>
                      <li>• Re-uploading master zip archives to torrents</li>
                      <li>• Malicious smart contract exploitation or draining</li>
                      <li>• Claiming direct authorship of core master templates</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. Disclaimer of Warranties & No Financial Advice */}
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono-code">3</span>
                  No Financial Advice &amp; Web3 Tool Execution
                </h4>
                <p className="text-slate-400">
                  All developer scripts (including DEX copy-traders, volume bots, token snipers, and fee calculators) are provided "AS IS" for technical educational and developer utility purposes.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                  <li>Nothing on this site constitutes financial, investment, or legal advice.</li>
                  <li>Cryptocurrency trading and smart contract deployment carries inherent market and execution risks, including slippage, network congestion, and potential loss of principal.</li>
                  <li>Users maintain 100% responsibility for validating RPC configurations, private key management, and transaction simulation before mainnet deployment.</li>
                </ul>
              </section>

              {/* 4. Affiliate & Referral Terms */}
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono-code">4</span>
                  Affiliate Program Terms
                </h4>
                <p className="text-slate-400">
                  Affiliate participants earn a standard 30% commission on qualifying referred checkouts. Payouts are non-custodial and redeemable on-chain to the affiliate's registered Solana wallet. Spamming, search engine trademark hijacking, or misleading marketing claims are strictly prohibited.
                </p>
              </section>

              {/* 5. Limitation of Liability */}
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-mono-code">5</span>
                  Limitation of Liability
                </h4>
                <p className="text-slate-400">
                  In no event shall SolPump Store or its contributors be liable for any indirect, incidental, special, or consequential damages resulting from the use of or inability to use the digital products, tools, or smart contracts.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800/90 bg-slate-900/60 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono-code text-[11px]">Legally Binding On-Chain Protocol Terms</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            id="acknowledge-legal-btn"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
