import React from 'react';

export const LegalView: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  if (type === 'privacy') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-400">
            Last updated: October 2026 &middot; Tindry.com
          </p>
        </div>

        <section className="space-y-2 pt-4">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            1. Core Principle: Zero Cloud Uploads
          </h2>
          <p>
            At Tindry, your files remain strictly private. All conversions, mergings, renderings, and image compression routines are performed entirely client-side inside your web browser.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            2. Information We Do Not Collect
          </h2>
          <p>
            We do not transmit, inspect, store, or log any files or personal document contents you process. When you close or refresh your browser tab, memory buffers containing your file data are cleared by the browser.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            3. Local Browser Storage
          </h2>
          <p>
            Tindry does not utilize invasive tracking cookies or profiling beacons. Any client state is strictly transient and maintained solely for your current active session.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-neutral-400">
          Last updated: October 2026 &middot; Tindry.com
        </p>
      </div>

      <section className="space-y-2 pt-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using Tindry.com, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          2. Permitted Use
        </h2>
        <p>
          Tindry provides client-side online tools for MP4 to MP3 conversion, PDF merging, JPG to PDF conversion, PDF to JPG extraction, and image compression. You agree to use the service only for lawful purposes.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          3. Disclaimer of Warranties
        </h2>
        <p>
          Tindry is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, either express or implied.
        </p>
      </section>
    </div>
  );
};
