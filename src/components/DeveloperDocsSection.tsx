import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  BookOpen,
  Copy,
  Check,
  Zap,
  Sparkles,
  Layers,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Cpu,
  Coins,
  Key,
  Globe,
  Database,
  ArrowUpRight,
  CheckCircle2,
  FileCode,
  Server,
  Workflow,
  Lock,
} from 'lucide-react';

interface EndpointDoc {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  title: string;
  badge: string;
  description: string;
  headers: { [key: string]: string };
  params?: { name: string; type: string; required: boolean; description: string }[];
  body?: { [key: string]: any };
  curlSnippet: string;
  jsSnippet: string;
  pythonSnippet: string;
  sampleResponse: any;
}

export const DeveloperDocsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'endpoints' | 'sdk' | 'architecture'>('endpoints');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('tools');
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'js' | 'python'>('js');
  const [testResponseState, setTestResponseState] = useState<{ [key: string]: boolean }>({});

  const contractAddress = 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS';

  const endpoints: EndpointDoc[] = [
    {
      id: 'tools',
      method: 'GET',
      path: '/api/v1/tools',
      title: 'Fetch Micro-Tools & Utility Catalog',
      badge: 'Public • No Auth Required',
      description: 'Returns the complete real-time directory of client-side micro-tools, categories (AI, Web3, Dev), versioning, and download checksums.',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SolPumpStore-Client/1.0',
      },
      curlSnippet: `curl -X GET "https://sol-pump.store/api/v1/tools?category=all" \\
  -H "Accept: application/json"`,
      jsSnippet: `// Fetch available micro-tools & utilities
const response = await fetch('https://sol-pump.store/api/v1/tools?category=web3', {
  headers: {
    'Accept': 'application/json'
  }
});
const { data, meta } = await response.json();
console.log('Available Tools:', data.length, 'Engine:', meta.clientEngine);`,
      pythonSnippet: `import requests

response = requests.get(
    "https://sol-pump.store/api/v1/tools",
    params={"category": "all"},
    headers={"Accept": "application/json"}
)
tools = response.json()
print(f"Loaded {len(tools['data'])} active tools")`,
      sampleResponse: {
        status: 'success',
        meta: {
          version: 'v1.4.2',
          totalTools: 9,
          clientEngine: 'Standalone Pure JS/WASM',
          timestamp: '2026-08-27T07:30:00Z',
        },
        data: [
          {
            id: 'sol-fee-estimator',
            name: 'Solana Gas & Priority Fee Estimator',
            category: 'web3',
            type: 'Client-Side Realtime Calculator',
            supportedChains: ['Solana', 'TON'],
            openSource: true,
            status: 'operational',
          },
          {
            id: 'token-metadata-inspector',
            name: 'Jetton & SPL Metadata Inspector',
            category: 'web3',
            type: 'On-Chain Parser',
            supportedChains: ['TON', 'Solana'],
            openSource: true,
            status: 'operational',
          },
          {
            id: 'n8n-leadgen-workflow',
            name: 'WhatsApp & Telegram AI Auto-Responder',
            category: 'ai',
            type: 'Workflow Blueprint',
            supportedChains: ['Any'],
            openSource: true,
            status: 'operational',
          },
        ],
      },
    },
    {
      id: 'metrics',
      method: 'GET',
      path: '/api/v1/metrics',
      title: 'Real-Time $sopump & Node Telemetry',
      badge: 'Live Blockchain Feed',
      description: 'Provides live verified market telemetry for the $sopump token on TON, including decentralized liquidity pool states, DEX volume, and block height.',
      headers: {
        'Accept': 'application/json',
      },
      curlSnippet: `curl -X GET "https://sol-pump.store/api/v1/metrics?contract=${contractAddress}" \\
  -H "Accept: application/json"`,
      jsSnippet: `// Query on-chain token metrics & block height
const res = await fetch('https://sol-pump.store/api/v1/metrics', {
  method: 'GET',
  headers: { 'Accept': 'application/json' }
});
const metrics = await res.json();
console.log('$sopump USD Price:', metrics.data.priceUSD);
console.log('TON Block Height:', metrics.data.tonBlockHeight);`,
      pythonSnippet: `import requests

res = requests.get("https://sol-pump.store/api/v1/metrics")
metrics = res.json()["data"]
print(f"Price: " + str(metrics['priceUSD']) + " | Liquidity: " + str(metrics['liquidityUSD']))`,
      sampleResponse: {
        status: 'success',
        network: 'TON Mainnet',
        token: {
          symbol: '$sopump',
          contractAddress: 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS',
          standard: 'TON Jetton (TEP-74)',
        },
        data: {
          priceUSD: 0.00428,
          priceTON: 0.00074,
          change24h: '+14.82%',
          volume24hUSD: 148920,
          liquidityUSD: 86450,
          tonBlockHeight: 41829402,
          activeHolders: 1842,
          nodeStatus: 'HEALTHY_SYNCED',
        },
      },
    },
    {
      id: 'verify-holder',
      method: 'POST',
      path: '/api/v1/verify-holder',
      title: 'Verify Holder Status & License Keys',
      badge: 'Signature / Key Auth',
      description: 'Verifies whether a user address holds $sopump tokens on TON/Solana or validates a Pro Developer / Enterprise cryptographic license key.',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: {
        walletAddress: 'EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm',
        chain: 'ton',
        licenseKey: 'SOLPUMP-PRO-9842X-7821',
      },
      curlSnippet: `curl -X POST "https://sol-pump.store/api/v1/verify-holder" \\
  -H "Content-Type: application/json" \\
  -d '{
    "walletAddress": "EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm",
    "chain": "ton",
    "licenseKey": "SOLPUMP-PRO-9842X-7821"
  }'`,
      jsSnippet: `// Verify Web3 holder tier or developer license
const response = await fetch('https://sol-pump.store/api/v1/verify-holder', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    walletAddress: 'EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm',
    chain: 'ton',
    licenseKey: 'SOLPUMP-PRO-9842X-7821',
  }),
});

const verification = await response.json();
if (verification.isEligible) {
  console.log('Unlocked Tier:', verification.tier);
}`,
      pythonSnippet: `import requests

payload = {
    "walletAddress": "EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm",
    "chain": "ton",
    "licenseKey": "SOLPUMP-PRO-9842X-7821"
}

resp = requests.post("https://sol-pump.store/api/v1/verify-holder", json=payload)
data = resp.json()
print("Verification Status:", data["isEligible"], "| Tier:", data["tier"])`,
      sampleResponse: {
        status: 'success',
        isEligible: true,
        tier: 'Pro Developer (Lifetime)',
        holderVerification: {
          hasTokenBalance: true,
          sopumpBalance: '15400.00',
          qualifiesForDiscount: true,
        },
        licenseDetails: {
          key: 'SOLPUMP-PRO-9842X-7821',
          issuedAt: '2026-08-27T07:15:00Z',
          permissions: ['jito_mev_sniper', 'telegram_clicker_source', 'n8n_master_blueprints'],
        },
      },
    },
  ];

  const currentEndpoint = endpoints.find((e) => e.id === selectedEndpointId) || endpoints[0];

  const handleCopy = async (code: string, id: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedCodeSnippet(id);
      setTimeout(() => setCopiedCodeSnippet(null), 2000);
    } catch (err) {
      console.error('Failed to copy code snippet:', err);
    }
  };

  const handleTriggerTestResponse = (id: string) => {
    setTestResponseState((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setTestResponseState((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  return (
    <section
      id="dev-docs"
      className="py-20 md:py-28 bg-[#070a14] border-y border-slate-800/80 relative overflow-hidden"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[300px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[300px] bg-purple-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer Reference &amp; REST Interface</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Developer Documentation &amp; API Hub
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Integrate high-speed Web3 utilities, query live <strong className="text-emerald-400 font-mono">$sopump</strong> token telemetry on TON, and embed client-side micro-tools directly into your decentralised applications.
          </p>
        </div>

        {/* Top Navigation Mode Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          <button
            type="button"
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'endpoints'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>API Endpoints</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quickstart')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'quickstart'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Start Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sdk')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'sdk'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JavaScript &amp; Embed SDK</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Architecture &amp; Security</span>
          </button>
        </div>

        {/* TAB 1: API ENDPOINTS INTERFACE */}
        {activeTab === 'endpoints' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            
            {/* Left 4 Cols: Endpoint Selector List */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold block px-1">
                Available REST Endpoints:
              </span>

              {endpoints.map((ep) => {
                const isSelected = ep.id === selectedEndpointId;
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => setSelectedEndpointId(ep.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#0d1424] border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                        : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md ${
                            ep.method === 'GET'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {ep.path}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ep.title}
                    </p>
                    
                    <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{ep.badge}</span>
                    </div>
                  </button>
                );
              })}

              {/* Ecosystem Contract Box */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 mt-6">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  TON Network Contract Address:
                </span>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 break-all select-all">
                  {contractAddress}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>Standard: TEP-74 Jetton</span>
                  <a
                    href={`https://tonviewer.com/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right 8 Cols: Detailed Endpoint Playground & Documentation */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Endpoint Overview Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0f1d] border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg ${
                        currentEndpoint.method === 'GET'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {currentEndpoint.method}
                    </span>
                    <h3 className="text-xl font-extrabold text-white font-mono">
                      {currentEndpoint.path}
                    </h3>
                  </div>

                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 self-start sm:self-auto">
                    {currentEndpoint.badge}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentEndpoint.description}
                </p>

                {/* Headers Table */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                    Required Headers:
                  </span>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
                    {Object.entries(currentEndpoint.headers).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-slate-300">
                        <span className="text-cyan-400">{k}:</span>
                        <span className="text-slate-400">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Request Body Specification (for POST) */}
                {currentEndpoint.body && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono uppercase text-purple-400 font-bold block">
                      JSON Payload Body Schema:
                    </span>
                    <pre className="p-3.5 rounded-xl bg-[#060810] border border-slate-800 text-xs font-mono text-purple-300 overflow-x-auto">
                      {JSON.stringify(currentEndpoint.body, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Code Snippet Box with Language Switcher */}
              <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 shadow-xl overflow-hidden">
                
                {/* Snippet Header */}
                <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white">Client Code Example:</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setCodeLanguage('js')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          codeLanguage === 'js' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        JavaScript
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeLanguage('curl')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          codeLanguage === 'curl' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        cURL
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeLanguage('python')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          codeLanguage === 'python' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Python
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const code =
                          codeLanguage === 'js'
                            ? currentEndpoint.jsSnippet
                            : codeLanguage === 'curl'
                            ? currentEndpoint.curlSnippet
                            : currentEndpoint.pythonSnippet;
                        handleCopy(code, currentEndpoint.id);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                      title="Copy Code Snippet"
                    >
                      {copiedCodeSnippet === currentEndpoint.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Preformatted Code Content */}
                <div className="p-6 bg-[#060810] overflow-x-auto">
                  <pre className="text-xs font-mono leading-relaxed text-slate-200">
                    <code>
                      {codeLanguage === 'js'
                        ? currentEndpoint.jsSnippet
                        : codeLanguage === 'curl'
                        ? currentEndpoint.curlSnippet
                        : currentEndpoint.pythonSnippet}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Sample Response Preview with Test Trigger */}
              <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 shadow-xl overflow-hidden">
                <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white">200 OK — Sample Response (JSON)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTriggerTestResponse(currentEndpoint.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {testResponseState[currentEndpoint.id] ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Simulated!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Run Mock Test</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-6 bg-[#060810] overflow-x-auto">
                  <pre className="text-xs font-mono leading-relaxed text-emerald-400">
                    <code>{JSON.stringify(currentEndpoint.sampleResponse, null, 2)}</code>
                  </pre>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: QUICK START GUIDE */}
        {activeTab === 'quickstart' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-slate-800 space-y-3 relative group hover:border-cyan-500/40 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-extrabold text-base">
                  01
                </div>
                <h4 className="text-lg font-bold text-white">Connect Decentralized Wallet</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Support for Tonkeeper, Telegram Wallet (@wallet), Phantom, and Solflare. No registration required — purely signature authenticated.
                </p>
                <div className="pt-2 text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <span>Non-Custodial</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-slate-800 space-y-3 relative group hover:border-emerald-500/40 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-extrabold text-base">
                  02
                </div>
                <h4 className="text-lg font-bold text-white">Access Free vs. Pro Modules</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download ready-to-run 1-click Python &amp; Node.js bots, prompt catalogs, and n8n templates directly or unlock institutional source code.
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span>Instant ZIP Download</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-slate-800 space-y-3 relative group hover:border-purple-500/40 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-extrabold text-base">
                  03
                </div>
                <h4 className="text-lg font-bold text-white">Embed Widgets &amp; Telemetry</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Include real-time fee estimators, token tickers, or automated webhooks directly into your Web3 applications with our lightweight SDK.
                </p>
                <div className="pt-2 text-[11px] font-mono text-purple-400 flex items-center gap-1">
                  <span>Zero Server Dependency</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>

            {/* Quick Start Installation Code Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f1d] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-base font-bold text-white">Install sol-pump.store SDK (npm / yarn / pnpm)</h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('npm install @solpump/sdk-web3 ethers @solana/web3.js @ton/ton', 'install-cmd')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCodeSnippet === 'install-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCodeSnippet === 'install-cmd' ? 'Copied' : 'Copy Command'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#060810] font-mono text-xs text-emerald-400 overflow-x-auto">
                <code>npm install @solpump/sdk-web3 ethers @solana/web3.js @ton/ton</code>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JAVASCRIPT & EMBED SDK */}
        {activeTab === 'sdk' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f1d] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white">Embeddable Live Ticker Widget (HTML / React)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Embed the $sopump live market ticker widget directly into your Web3 frontend or Telegram Mini App.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `<iframe src="https://sol-pump.store/embed/ticker" width="100%" height="90" frameborder="0" style="border-radius: 16px; overflow: hidden;"></iframe>`,
                      'embed-code'
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  {copiedCodeSnippet === 'embed-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Embed Code</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#060810] font-mono text-xs text-cyan-300 overflow-x-auto">
                <code>{`<iframe src="https://sol-pump.store/embed/ticker" width="100%" height="90" frameborder="0" style="border-radius: 16px; overflow: hidden;"></iframe>`}</code>
              </div>
            </div>

            {/* SDK Code Snippet */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f1d] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white">TypeScript SDK Initialization</h4>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `import { SolPumpClient } from '@solpump/sdk-web3';

const client = new SolPumpClient({
  network: 'ton-mainnet',
  contractAddress: 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS',
});

// Stream real-time telemetry updates
client.on('metricUpdate', (telemetry) => {
  console.log('Live Telemetry:', telemetry.priceUSD, telemetry.volume24hUSD);
});`,
                      'ts-sdk'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCodeSnippet === 'ts-sdk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy TypeScript</span>
                </button>
              </div>

              <pre className="p-5 rounded-2xl bg-[#060810] font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                <code>{`import { SolPumpClient } from '@solpump/sdk-web3';

const client = new SolPumpClient({
  network: 'ton-mainnet',
  contractAddress: 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS',
});

// Stream real-time telemetry updates
client.on('metricUpdate', (telemetry) => {
  console.log('Live Telemetry:', telemetry.priceUSD, telemetry.volume24hUSD);
});`}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: ARCHITECTURE & SECURITY */}
        {activeTab === 'architecture' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0f1d] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">100% Client-Side Execution Engine</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                All data manipulation, cryptography, ZIP asset packaging (JSZip), and QR generation execute directly inside the user's browser sandbox. No user data or private keys are transmitted to centralized servers.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0f1d] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Immutable Token Standard (TEP-74)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The native $sopump utility token is deployed under the verified open standard on the TON mainnet with permanent decentralized DEX liquidity routing on STON.fi and DeDust.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Direct Telegram Dev Desk CTA */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0c1428] via-[#091020] to-[#0d152c] border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-extrabold text-white">Need Custom Web3 API Endpoints or White-Label Bots?</h4>
            <p className="text-xs text-slate-400 font-mono">
              Our core engineering team provides custom smart contract builds, private Telegram bots, and n8n integrations.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <a
              href="https://t.me/solpump_store"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Developer Telegram Desk</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
