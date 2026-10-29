export interface PageSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
  noindex?: boolean;
  schemaType?: 'WebApplication' | 'WebSite' | 'FAQPage' | 'Article';
  faqItems?: Array<{ question: string; answer: string }>;
}

export const SEO_CONFIGS: Record<string, PageSeoConfig> = {
  home: {
    title: 'Tindry - Simple Online File Tools',
    description:
      'Convert, merge and compress files online with Tindry. Simple and fast tools for MP4 to MP3, PDF merging, JPG to PDF, PDF to JPG and image compression.',
    canonicalPath: '/',
    h1: 'Simple file tools that just work.',
    schemaType: 'WebSite',
  },
  'all-tools': {
    title: 'Tindry - Simple Online File Tools',
    description:
      'Convert, merge and compress files online with Tindry. Simple and fast tools for MP4 to MP3, PDF merging, JPG to PDF, PDF to JPG and image compression.',
    canonicalPath: '/',
    h1: 'All File Tools',
    schemaType: 'WebApplication',
  },
  'mp4-to-mp3': {
    title: 'MP4 to MP3 - Extract Audio in Seconds Offline | Tindry',
    description:
      'Free MP4 to MP3 converter. Extract audio in seconds. 100% private, no uploads, works offline in your browser.',
    canonicalPath: '/mp4-to-mp3',
    h1: 'MP4 to MP3 Converter',
    schemaType: 'WebApplication',
  },
  'webm-to-mp4': {
    title: 'WebM to MP4 Converter - Fast Video Conversion | Tindry',
    description:
      'Convert WebM to MP4 free. Fast video conversion in browser. No uploads, 100% offline and private.',
    canonicalPath: '/webm-to-mp4',
    h1: 'WebM to MP4 Converter',
    schemaType: 'WebApplication',
  },
  'merge-pdf': {
    title: 'Merge PDF - Combine PDF Files Easily Free | Tindry',
    description:
      'Free Merge PDF tool. Combine multiple PDF files easily. 100% private, no file upload, offline processing.',
    canonicalPath: '/merge-pdf',
    h1: 'Merge PDF',
    schemaType: 'WebApplication',
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF Converter - Free & Offline | Tindry',
    description:
      'Convert JPG to PDF free. Turn images to PDF online, no upload, 100% private, offline converter.',
    canonicalPath: '/jpg-to-pdf',
    h1: 'JPG to PDF Converter',
    schemaType: 'WebApplication',
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter - Extract Images Free | Tindry',
    description:
      'Convert PDF to JPG free. Extract images from PDF online, no upload, private & offline.',
    canonicalPath: '/pdf-to-jpg',
    h1: 'PDF to JPG Converter',
    schemaType: 'WebApplication',
  },
  'compress-image': {
    title: 'Compress Image - Reduce Size No Quality Loss | Tindry',
    description:
      'Compress images online free. Reduce size with no quality loss. 100% private, no uploads, files stay in browser.',
    canonicalPath: '/compress-image',
    h1: 'Compress Image',
    schemaType: 'WebApplication',
  },
  'screen-record': {
    title: 'Screen Record - Directly in Your Browser | Tindry',
    description:
      'Free screen recorder directly in browser. No download needed. 100% private, offline, secure screen recording.',
    canonicalPath: '/screen-record',
    h1: 'Private Screen Recorder',
    schemaType: 'WebApplication',
  },
  faq: {
    title: 'Tindry FAQ - Frequently Asked Questions',
    description:
      "Find answers to common questions about Tindry's online file conversion and compression tools.",
    canonicalPath: '/faq',
    h1: 'Frequently Asked Questions',
    noindex: false,
    schemaType: 'FAQPage',
    faqItems: [
      {
        question: 'Are my files uploaded to any servers?',
        answer:
          'No. Tindry operates 100% in your browser using modern Web APIs, WebAssembly, and local processing. Your files never leave your device.',
      },
      {
        question: 'Is Tindry free to use?',
        answer:
          'Yes. All file processing tools on Tindry are completely free with no registration required.',
      },
      {
        question: 'How do I convert MP4 videos to MP3 audio?',
        answer:
          'Select or drag-and-drop your MP4 video file, choose your preferred bitrate, and click Convert to MP3 to immediately download your audio file.',
      },
      {
        question: 'Can I reorder pages when merging PDFs?',
        answer:
          'Yes. In the Merge PDF tool, you can upload multiple PDF documents, move files up or down to set your preferred order, and combine them into a single PDF.',
      },
      {
        question: 'What image formats can I compress with Tindry?',
        answer:
          'You can compress JPG, JPEG, PNG, and WebP images with adjustable quality sliders and optional resolution limits.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy | Tindry',
    description:
      'Read the Tindry Privacy Policy. Learn how we prioritize user privacy with client-side, zero-upload file operations.',
    canonicalPath: '/privacy',
    h1: 'Privacy Policy',
    noindex: false,
    schemaType: 'WebSite',
  },
  terms: {
    title: 'Terms of Service | Tindry',
    description:
      'Read the Terms of Service for using Tindry online file conversion and compression tools.',
    canonicalPath: '/terms',
    h1: 'Terms of Service',
    noindex: false,
    schemaType: 'WebSite',
  },
  contact: {
    title: 'Contact Tindry',
    description:
      'Get in touch with the Tindry team for questions, feedback, or technical inquiries.',
    canonicalPath: '/contact',
    h1: 'Contact Tindry',
    noindex: false,
    schemaType: 'WebSite',
  },
  blog: {
    title: 'Tindry Blog - Privacy & Offline Tools',
    description:
      'Learn how to work 100% offline without risking your files. Practical guides, architecture breakdowns, and data privacy advice from the founder in Salé, Morocco.',
    canonicalPath: '/blog',
    h1: 'Tindry Blog - Privacy & Offline Tools',
    noindex: false,
    schemaType: 'WebSite',
  },
  'blog/how-to-compress-images-without-uploading': {
    title: 'Compress Images Without Uploading | Private Guide',
    description:
      'Learn how to compress images 100% offline in your browser without uploading to cloud servers. Keep your private photos secure.',
    canonicalPath: '/blog/how-to-compress-images-without-uploading',
    h1: 'How to Compress Images Without Uploading Them to Cloud Servers',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/why-offline-pdf-tools-are-safer': {
    title: 'Why Offline PDF Tools Are Safer | Complete Privacy',
    description:
      'Discover why uploading sensitive PDFs to cloud converters is a security risk and how client-side processing keeps your documents private.',
    canonicalPath: '/blog/why-offline-pdf-tools-are-safer',
    h1: 'Why Offline PDF Tools Are Far Safer Than Traditional Web Converters',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/create-invoices-offline': {
    title: 'Create Invoices Offline & Protect Client Data | Tindry',
    description:
      'Protect confidential client rates and banking details by creating and editing invoices completely offline in your browser without cloud uploads.',
    canonicalPath: '/blog/create-invoices-offline',
    h1: 'How to Create and Convert Invoices Offline to Protect Confidential Client Data',
    noindex: false,
    schemaType: 'Article',
  },
};
