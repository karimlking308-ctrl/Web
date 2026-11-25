import React, { useState } from 'react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();
    if (!name || !message) return;

    const subject = encodeURIComponent(`Tindry Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}${email ? `\nEmail: ${email}` : ''}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:tindry.official@gmail.com?subject=${subject}&body=${body}`;
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

      <div className="pt-6 border-t border-neutral-200 text-xs text-neutral-500">
        <p>
          Direct inquiries:{' '}
          <a
            href="mailto:tindry.official@gmail.com"
            className="font-mono text-black font-medium underline hover:opacity-80"
          >
            tindry.official@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};
