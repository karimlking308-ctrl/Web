export interface PageSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
  schemaType?: 'WebApplication' | 'WebSite' | 'FAQPage';
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
    title: 'All File Tools - Convert, Merge and Compress | Tindry',
    description:
      'Browse all online file tools on Tindry. Clean, fast utilities for MP4 to MP3, PDF merging, JPG to PDF, PDF to JPG, and image compression.',
    canonicalPath: '/tools',
    h1: 'All File Tools',
    schemaType: 'WebApplication',
  },
  'mp4-to-mp3': {
    title: 'MP4 to MP3 Converter - Convert Video to Audio | Tindry',
    description:
      "Convert MP4 videos to MP3 audio quickly with Tindry's simple online MP4 to MP3 converter.",
    canonicalPath: '/tools/mp4-to-mp3',
    h1: 'MP4 to MP3 Converter',
    schemaType: 'WebApplication',
  },
  'merge-pdf': {
    title: 'Merge PDF Files Online - Free PDF Merger | Tindry',
    description:
      'Merge multiple PDF files into one PDF document quickly and easily with Tindry.',
    canonicalPath: '/tools/merge-pdf',
    h1: 'Merge PDF',
    schemaType: 'WebApplication',
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF Converter - Convert Images to PDF | Tindry',
    description:
      "Convert JPG and JPEG images into PDF files quickly with Tindry's online JPG to PDF converter.",
    canonicalPath: '/tools/jpg-to-pdf',
    h1: 'JPG to PDF Converter',
    schemaType: 'WebApplication',
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter - Convert PDF Pages to Images | Tindry',
    description:
      'Convert PDF pages into JPG images quickly and easily with Tindry.',
    canonicalPath: '/tools/pdf-to-jpg',
    h1: 'PDF to JPG Converter',
    schemaType: 'WebApplication',
  },
  'compress-image': {
    title: 'Compress Image Online - Reduce Image Size | Tindry',
    description:
      'Compress images online and reduce file size while maintaining good image quality with Tindry.',
    canonicalPath: '/tools/compress-image',
    h1: 'Compress Image',
    schemaType: 'WebApplication',
  },
  faq: {
    title: 'Tindry FAQ - Frequently Asked Questions',
    description:
      "Find answers to common questions about Tindry's online file conversion and compression tools.",
    canonicalPath: '/faq',
    h1: 'Frequently Asked Questions',
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
          'Yes. All five file processing tools on Tindry are completely free with no registration required.',
      },
      {
        question: 'How do I convert MP4 videos to MP3 audio?',
        answer:
          'Select or drag-and-drop your MP4 video file, choose your preferred bitrate (128 kbps, 192 kbps, or 320 kbps), and click Convert to MP3 to immediately download your audio file.',
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
    schemaType: 'WebSite',
  },
  terms: {
    title: 'Terms of Service | Tindry',
    description:
      'Read the Terms of Service for using Tindry online file conversion and compression tools.',
    canonicalPath: '/terms',
    h1: 'Terms of Service',
    schemaType: 'WebSite',
  },
  contact: {
    title: 'Contact Tindry',
    description:
      'Get in touch with the Tindry team for questions, feedback, or technical inquiries.',
    canonicalPath: '/contact',
    h1: 'Contact Tindry',
    schemaType: 'WebSite',
  },
};
