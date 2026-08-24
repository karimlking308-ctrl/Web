import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { X, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from '../common/Logo';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode = 'login', onClose }) => {
  const { login, signup } = useCommerce();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('admin@sol-pump.store');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('John Doe');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email, password);
    } else {
      signup(name, email, password);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f1422] border border-slate-800 p-8 shadow-2xl shadow-indigo-500/10 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Logo size="md" light={true} />
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Welcome back to SOLPUMP' : 'Start your commerce journey'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Enterprise-grade multi-tenant merchant portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Work Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                placeholder="name@business.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center justify-center gap-2 mt-6"
          >
            {mode === 'login' ? 'Sign in to Merchant Dashboard' : 'Launch Free Commerce Store'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
          {mode === 'login' ? (
            <p className="text-xs text-slate-400">
              Don't have a store yet?{' '}
              <button onClick={() => setMode('signup')} className="text-indigo-400 font-bold hover:underline cursor-pointer">
                Start for free
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-indigo-400 font-bold hover:underline cursor-pointer">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
