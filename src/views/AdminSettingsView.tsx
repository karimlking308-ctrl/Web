import React, { useEffect, useState } from 'react';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { Lock, LogOut, RotateCcw, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

const ADMIN_EMAIL = 'abdoirizi4398@gmail.com';
const SEO_STORAGE_KEY = 'tindry_cv_seo_settings_v1';

interface CvSeoSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

const DEFAULT_CV_SEO: CvSeoSettings = {
  title: 'Tindry - Free CV Builder | Create Professional CV in Minutes',
  description:
    'Create a professional CV for free with Tindry. Choose from 6 templates, add your photo, QR code, and download as PDF or Image. No sign-up needed.',
  keywords:
    'free cv builder, create cv online, cv maker, resume builder, cv with qr code, cv maroc, cv canada',
  ogImage: 'https://tindry.com/opengraph-image.png',
};

function isValidSafeUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function loadSavedCvSeo(): CvSeoSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_CV_SEO };
  try {
    const raw = window.localStorage.getItem(SEO_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CV_SEO };
    const parsed = JSON.parse(raw) as Partial<CvSeoSettings>;
    return {
      title: typeof parsed.title === 'string' ? parsed.title : DEFAULT_CV_SEO.title,
      description:
        typeof parsed.description === 'string' ? parsed.description : DEFAULT_CV_SEO.description,
      keywords: typeof parsed.keywords === 'string' ? parsed.keywords : DEFAULT_CV_SEO.keywords,
      ogImage:
        typeof parsed.ogImage === 'string' && isValidSafeUrl(parsed.ogImage)
          ? parsed.ogImage
          : DEFAULT_CV_SEO.ogImage,
    };
  } catch {
    return { ...DEFAULT_CV_SEO };
  }
}

function getFirebaseAuth() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

export const AdminSettingsView: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [formState, setFormState] = useState<CvSeoSettings>({ ...DEFAULT_CV_SEO });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const isAuthorizedAdmin = Boolean(
    authUser &&
      authUser.email &&
      authUser.email.toLowerCase() === ADMIN_EMAIL &&
      authUser.emailVerified
  );

  useEffect(() => {
    if (isAuthorizedAdmin) {
      setFormState(loadSavedCvSeo());
    }
  }, [isAuthorizedAdmin]);

  const handleSignIn = async () => {
    setAuthError(null);
    setAuthBusy(true);
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code)
          : '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in was cancelled.');
      } else {
        setAuthError('Unable to sign in right now. Please try again.');
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    setSaveMessage(null);
    setFormError(null);
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
    } catch {
      setAuthError('Failed to sign out. Please refresh and try again.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorizedAdmin) return;

    setSaveMessage(null);
    setFormError(null);

    const title = formState.title.trim().slice(0, 160);
    const description = formState.description.trim().slice(0, 320);
    const keywords = formState.keywords.trim().slice(0, 400);
    const ogImage = (formState.ogImage.trim() || DEFAULT_CV_SEO.ogImage).slice(0, 500);

    if (!title) {
      setFormError('Site Title cannot be empty.');
      return;
    }
    if (!description) {
      setFormError('Meta Description cannot be empty.');
      return;
    }
    if (!isValidSafeUrl(ogImage)) {
      setFormError('OG Image URL must use https://, http://, or a site-relative / path.');
      return;
    }

    const sanitized: CvSeoSettings = { title, description, keywords, ogImage };
    try {
      window.localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(sanitized));
      setFormState(sanitized);
      setSaveMessage('SEO settings saved for CV Builder.');
    } catch {
      setFormError('Could not save settings to browser storage.');
    }
  };

  const handleResetDefaults = () => {
    if (!isAuthorizedAdmin) return;
    setFormError(null);
    try {
      window.localStorage.removeItem(SEO_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    setFormState({ ...DEFAULT_CV_SEO });
    setSaveMessage('SEO settings reset to defaults.');
  };

  if (!authReady) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-neutral-600">Checking administrator session...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="rounded-2xl border border-[#D4AF37] bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-black text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-black">Admin Settings</h1>
              <p className="text-xs text-neutral-500">Restricted to site administrator</p>
            </div>
          </div>

          <p className="text-sm text-neutral-700 leading-relaxed mb-5">
            Sign in with the authorized administrator Google account to manage SEO metadata.
          </p>

          {authError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              {authError}
            </div>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={authBusy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-black hover:bg-neutral-900 disabled:opacity-60 text-[#D4AF37] border border-[#D4AF37] px-4 py-3 text-sm font-semibold transition-colors cursor-pointer"
          >
            <span>{authBusy ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="rounded-2xl border border-red-200 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-black">Access Denied</h1>
              <p className="text-xs text-neutral-500">Administrator authorization required</p>
            </div>
          </div>

          <p className="text-sm text-neutral-700 leading-relaxed mb-5">
            The signed-in account does not have permission to access Admin SEO Settings.
          </p>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-black px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="rounded-2xl border border-[#D4AF37] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-neutral-200">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#B8860B] mb-1">
              Administrator Only
            </span>
            <h1 className="text-2xl font-bold text-black">SEO Settings &mdash; CV Builder</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Edit &lt;title&gt;, meta description, keywords, and Open Graph image for the CV Builder page.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="adminSeoTitle" className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Site Title
            </label>
            <input
              id="adminSeoTitle"
              type="text"
              value={formState.title}
              onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
              maxLength={160}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label htmlFor="adminSeoDesc" className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Meta Description
            </label>
            <textarea
              id="adminSeoDesc"
              rows={3}
              value={formState.description}
              onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
              maxLength={320}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label htmlFor="adminSeoKeywords" className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Keywords
            </label>
            <input
              id="adminSeoKeywords"
              type="text"
              value={formState.keywords}
              onChange={(e) => setFormState((prev) => ({ ...prev, keywords: e.target.value }))}
              maxLength={400}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label htmlFor="adminSeoOgImage" className="block text-xs font-semibold text-neutral-800 mb-1.5">
              OG Image URL
            </label>
            <input
              id="adminSeoOgImage"
              type="text"
              value={formState.ogImage}
              onChange={(e) => setFormState((prev) => ({ ...prev, ogImage: e.target.value }))}
              maxLength={500}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="rounded-lg border border-[#EFEAE0] bg-[#FAF8F3] px-3.5 py-2.5 text-xs text-neutral-700">
            <strong className="text-black">Crawl &amp; Indexing:</strong>{' '}
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">
              /sitemap.xml
            </a>{' '}
            &middot;{' '}
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">
              /robots.txt
            </a>
          </div>

          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              {formError}
            </div>
          )}

          {saveMessage && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-800"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{saveMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49b2d] text-black px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save SEO Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
