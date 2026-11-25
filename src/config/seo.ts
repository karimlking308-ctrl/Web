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
    title: 'Merge PDF Free Online - No Sign Up, 100% Private',
    description:
      'Merge PDF files for free online. No sign-up, no upload, 100% private. Combine multiple PDFs in seconds directly in your browser.',
    canonicalPath: '/merge-pdf',
    h1: 'Merge PDF Free Online',
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
      'Learn how to work 100% offline without risking your files. Practical guides, architecture breakdowns, and data privacy advice from the founder in Fes, Morocco.',
    canonicalPath: '/blog',
    h1: 'Tindry Blog - Privacy & Offline Tools',
    noindex: false,
    schemaType: 'WebSite',
  },
  about: {
    title: 'About Tindry - Built in Fes, Morocco',
    description:
      'Tindry was built by Abdo from Fes, Morocco. Tools that run 100% in your browser. Zero uploads. Zero tracking. No account. No watermark.',
    canonicalPath: '/about',
    h1: 'About Tindry',
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
  'blog/convert-mp4-to-mp3-offline-without-uploading': {
    title: 'Convert MP4 Video to MP3 Offline Without Uploading | Tindry',
    description:
      'Extract crystal-clear MP3 audio from MP4 videos 100% offline in your browser. Zero uploads, complete privacy, and fast local WebAssembly conversion.',
    canonicalPath: '/blog/convert-mp4-to-mp3-offline-without-uploading',
    h1: 'How to Convert MP4 Video to MP3 Offline Without Uploading',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/merge-multiple-pdf-files-into-one-offline': {
    title: 'Merge Multiple PDF Files Into One Offline | Tindry',
    description:
      'Combine contracts, bank statements, and multi-page scans into one PDF 100% offline inside your browser without uploading files to external servers.',
    canonicalPath: '/blog/merge-multiple-pdf-files-into-one-offline',
    h1: 'How to Merge Multiple PDF Files Into One Offline',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/convert-jpg-images-to-pdf-offline-official-documents': {
    title: 'Convert JPG Images to PDF Offline for Official Documents | Tindry',
    description:
      'Turn passport scans, ID photos, and receipts into clean official PDF documents 100% offline in your browser with zero server uploads.',
    canonicalPath: '/blog/convert-jpg-images-to-pdf-offline-official-documents',
    h1: 'How to Convert JPG Images to PDF Offline for Official Documents',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/compress-image-without-losing-quality-offline': {
    title: 'Compress an Image Without Losing Quality Offline | Tindry',
    description:
      'Reduce JPG, PNG, and WebP file sizes offline in your browser without losing sharp visual quality or leaking private EXIF metadata.',
    canonicalPath: '/blog/compress-image-without-losing-quality-offline',
    h1: 'How to Compress an Image Without Losing Quality Offline',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/remove-background-from-photo-in-3-seconds-offline': {
    title: 'Remove Background From Any Photo in 3 Seconds Offline | Tindry',
    description:
      'Erase photo backgrounds cleanly in 3 seconds directly in your browser. Zero cloud uploads, transparent PNG downloads, and full privacy.',
    canonicalPath: '/blog/remove-background-from-photo-in-3-seconds-offline',
    h1: 'How to Remove Background From Any Photo in 3 Seconds Offline',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/convert-iphone-heic-photos-to-jpg-offline': {
    title: 'Convert iPhone HEIC Photos to JPG Offline | Tindry',
    description:
      'Convert Apple iPhone HEIC photos to standard JPG directly inside your browser without installing paid codecs or uploading your camera roll.',
    canonicalPath: '/blog/convert-iphone-heic-photos-to-jpg-offline',
    h1: 'How to Convert iPhone HEIC Photos to JPG Offline',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/upscale-blurry-photo-to-hd-quality-offline': {
    title: 'Upscale a Blurry Photo to HD Quality Offline | Tindry',
    description:
      'Enhance and upscale blurry low-resolution photos up to 4x HD locally in your browser without server uploads or subscriptions.',
    canonicalPath: '/blog/upscale-blurry-photo-to-hd-quality-offline',
    h1: 'How to Upscale a Blurry Photo to HD Quality Offline',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/create-qr-code-offline-without-tracking': {
    title: 'Create a QR Code Offline Without Tracking | Tindry',
    description:
      'Generate permanent static QR codes for links, Wi-Fi, and social profiles offline with zero redirect tracking or expiring paywalls.',
    canonicalPath: '/blog/create-qr-code-offline-without-tracking',
    h1: 'How to Create a QR Code Offline Without Tracking',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/extract-colors-from-image-offline-for-logo': {
    title: 'Extract Colors From Any Image Offline for Your Logo | Tindry',
    description:
      'Extract exact HEX color palettes from logos and brand photos 100% offline in your browser without uploading client artwork.',
    canonicalPath: '/blog/extract-colors-from-image-offline-for-logo',
    h1: 'How to Extract Colors From Any Image Offline for Your Logo',
    noindex: false,
    schemaType: 'Article',
  },
  'blog/count-words-and-fix-text-case-offline': {
    title: 'Count Words and Fix Text Case Offline | Tindry',
    description:
      'Count words and characters and convert UPPERCASE, lowercase, and Title Case offline in your browser without pasting sensitive drafts online.',
    canonicalPath: '/blog/count-words-and-fix-text-case-offline',
    h1: 'How to Count Words and Fix Text Case Offline',
    noindex: false,
    schemaType: 'Article',
  },
  admin: {
    title: 'Admin Settings | Tindry',
    description: 'Administrator SEO settings for Tindry.',
    canonicalPath: '/admin',
    h1: 'Admin Settings',
    noindex: true,
    schemaType: 'WebSite',
  },
  settings: {
    title: 'Admin Settings | Tindry',
    description: 'Administrator SEO settings for Tindry.',
    canonicalPath: '/settings',
    h1: 'Admin Settings',
    noindex: true,
    schemaType: 'WebSite',
  },
};
