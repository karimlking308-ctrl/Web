import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  Sparkles, 
  X, 
  Send, 
  TrendingUp, 
  Tag, 
  ShoppingBag, 
  Megaphone, 
  Wand2, 
  Check, 
  Bot,
  User as UserIcon,
  ArrowRight
} from 'lucide-react';

interface AiAssistantModalProps {
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ onClose }) => {
  const { runAiPrompt, addDiscount, addProduct, setActiveTab } = useCommerce();
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello John! I'm your SOLPUMP AI Commerce Assistant. I can analyze your sales, create marketing campaigns, write high-converting product descriptions, or optimize your store. How can I help grow your store today?",
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    { label: 'Analyze my sales', icon: TrendingUp, prompt: 'Analyze my recent sales performance and tell me why revenue is growing.' },
    { label: 'Create a discount', icon: Tag, prompt: 'Generate a 20% discount code for our summer flash sale.' },
    { label: 'Build a campaign', icon: Megaphone, prompt: 'Create an automated email marketing campaign for VIP repeat buyers.' },
    { label: 'Improve conversion', icon: Wand2, prompt: 'How can I optimize my checkout conversion rate from 3.68% to 5%?' }
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || promptInput;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setPromptInput('');
    setLoading(true);

    try {
      const response = await runAiPrompt(text);
      let actionBtn;

      if (text.toLowerCase().includes('discount')) {
        actionBtn = {
          label: 'Apply Code SUMMER25 to Store',
          action: () => {
            addDiscount({
              code: 'SUMMER25',
              type: 'percentage',
              value: 25,
              status: 'active',
              minPurchase: 75
            });
            setActiveTab('discounts');
            onClose();
          }
        };
      }

      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: actionBtn
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#0f1422] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col h-[650px] overflow-hidden text-slate-100 font-sans">
        {/* Header */}
        <div className="p-4 sm:px-6 py-4 bg-[#141b2d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-white text-base tracking-tight flex items-center gap-2">
                SOLPUMP AI Assistant
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent commerce copilot for analytics, marketing, & growth</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(item.prompt)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700/60 transition cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[82%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.actionButton && (
                  <button
                    onClick={msg.actionButton.action}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-bold transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {msg.actionButton.label}
                  </button>
                )}

                <div className={`text-[10px] text-slate-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs italic">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <span>SOLPUMP AI is thinking and analyzing store data...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#141b2d] border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask anything about your store, products, or marketing..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!promptInput.trim() || loading}
              className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
