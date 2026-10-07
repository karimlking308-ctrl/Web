import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mb-2">
          Contact Tindry
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Have questions, suggestions, or feedback regarding Tindry file tools? Send us a message.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-xl border border-neutral-200 bg-neutral-50 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center mx-auto text-black">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            Message Sent
          </h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Thank you for reaching out. We appreciate your feedback on making Tindry the simplest file tools platform.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', message: '' });
            }}
            className="mt-4 px-4 py-2 border border-neutral-300 hover:border-black text-xs font-semibold rounded-md transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8 rounded-xl border border-neutral-200 bg-white">
          <div>
            <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Smith"
              className="w-full px-3.5 py-2.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex@example.com"
              className="w-full px-3.5 py-2.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can we help or improve your file workflow?"
              className="w-full px-3.5 py-2.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide rounded-md transition-colors"
          >
            Send Message
          </button>
        </form>
      )}

      <div className="pt-6 border-t border-neutral-200 text-xs text-neutral-500">
        <p>
          Direct inquiries:{' '}
          <span className="font-mono text-black font-medium">support@tindry.com</span>
        </p>
      </div>
    </div>
  );
};
