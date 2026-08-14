import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, FileText, HelpCircle, Mail, Globe, CheckCircle } from 'lucide-react';

interface LegalPageProps {
  pageType: 'about' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'faq';
}

export const LegalPage: React.FC<LegalPageProps> = ({ pageType }) => {
  const { lang, t, navigate } = useApp();
  const isAr = lang === 'ar';

  const renderContent = () => {
    switch (pageType) {
      case 'about':
        return (
          <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'عن كويك كيت (QuickKit)' : 'About QuickKit'}
            </h1>
            <p>
              {isAr
                ? 'كويك كيت هي منصة شاملة ومجانية 100% تجمع أكثر من 39 أداة أساسية لمعالجة الصور، ملفات PDF، تنسيق الأكواد، تحليل النصوص، الحسابات والتحويلات اليومية.'
                : 'QuickKit is an all-in-one suite of 39+ free, client-side online tools designed for developers, designers, students, and professionals worldwide.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <h3 className="font-bold text-amber-800 dark:text-amber-300 text-base mb-1">
                  {isAr ? 'خصوصية 100% بدون خوادم' : '100% Private & Browser-Side'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isAr
                    ? 'تتم جميع العمليات محلياً داخل متصفحك. لا يتم إرسال أي صورة أو ملف أو نص إلى أي خادم خارجي.'
                    : 'All file processing, conversions, and computations happen directly inside your browser. No files or private data are ever uploaded.'}
                </p>
              </div>

              <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-base mb-1">
                  {isAr ? 'مجاني بالكامل ودائم' : 'Forever Free, No Sign Up'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isAr
                    ? 'لا توجد رسوم خفية، لا توجد اشتراكات، ولا توجد قيود على عدد المرات التي تستخدم فيها أي أداة.'
                    : 'Instant access with zero subscriptions, paywalls, or limits on usage.'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>
            <p className="text-xs text-slate-400">
              {isAr ? 'آخر تحديث: 2026' : 'Last Updated: 2026'}
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
              {isAr ? '1. التزام الخصوصية المطلق' : '1. In-Browser Privacy Guarantee'}
            </h2>
            <p>
              {isAr
                ? 'نحن نؤمن بأن بياناتك هي ملكك الخاص. منصة كويك كيت مبنية بالكامل لتنفذ كافة العمليات (تغيير حجم الصور، تحويل ملفات PDF، تشفير وتنسيق الأكواد، وحساب الأرقام) داخل بيئة الـ JavaScript في متصفحك مباشرة (Client-Side). لن يتم نقل أي من ملفاتك إلى خوادمنا على الإطلاق.'
                : 'QuickKit is architected to perform all file modifications, conversions, code formatting, and data calculations purely within your local browser JavaScript engine. We do not store or transmit your source files, text, images, or documents to remote servers.'}
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
              {isAr ? '2. التخزين المحلي (Local Storage)' : '2. Local Preferences'}
            </h2>
            <p>
              {isAr
                ? 'نستخدم التخزين المحلي لمتصفحك فقط لحفظ تفضيلاتك الشخصية مثل اللغة المختارة، المظهر (الداكن/الفاتح)، وقائمة الأدوات المفضلة لديك.'
                : 'We use standard local storage to save your UI preferences (such as Dark/Light theme mode, Language choice, and Bookmarked favorite tools).'}
            </p>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'شروط الاستخدام' : 'Terms of Service'}
            </h1>
            <p>
              {isAr
                ? 'باستخدامك لمنصة QuickKit، فإنك توافق على الشروط والأحكام التالية:'
                : 'By using the QuickKit platform, you agree to the following terms:'}
            </p>
            <ul className="list-disc pl-5 rtl:pr-5 space-y-2 text-xs">
              <li>
                {isAr
                  ? 'يتم تقديم جميع الأدوات على أساس "كما هي" دون أي ضمانات صريحة أو ضمنية.'
                  : 'All utility tools are provided on an "as is" and "as available" basis without warranties of any kind.'}
              </li>
              <li>
                {isAr
                  ? 'يتحمل المستخدم المسؤولية الكاملة عن البيانات والملفات التي يقوم بمعالجتها.'
                  : 'Users are solely responsible for ensuring the legality and safety of their processed inputs.'}
              </li>
              <li>
                {isAr
                  ? 'يحظر استخدام الأدوات لأي أغراض غير قانونية أو انتهاك لحقوق الملكية الفكرية.'
                  : 'You may not use QuickKit for any unlawful purpose or copyright infringement.'}
              </li>
            </ul>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'اتصل بنا' : 'Contact QuickKit'}
            </h1>
            <p>
              {isAr
                ? 'هل لديك استفسار، اقتراح لإضافة أداة جديدة، أو تقرير عن خطأ؟ يسعدنا دائماً التواصل معك!'
                : 'Have a question, feedback, or a feature request for a new tool? We would love to hear from you!'}
            </p>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold">
                <Mail className="w-5 h-5 text-amber-500" />
                <span>support@quickkit.tools</span>
              </div>
              <p className="text-xs text-slate-500">
                {isAr ? 'فريق الدعم يرد خلال 24 ساعة في أيام العمل.' : 'Our team typically responds within 24 hours.'}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        {renderContent()}
      </div>
    </div>
  );
};
