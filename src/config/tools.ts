import { 
  Music, 
  Video,
  Files, 
  FileImage, 
  Image as ImageIcon, 
  Minimize2, 
  Sparkles,
  Smartphone,
  Scaling,
  Crop,
  QrCode,
  Palette,
  FileText,
  RefreshCw,
  LucideIcon 
} from 'lucide-react';

export type ToolId = 
  | 'mp4-to-mp3' 
  | 'webm-to-mp4' 
  | 'merge-pdf' 
  | 'jpg-to-pdf' 
  | 'pdf-to-jpg' 
  | 'compress-image'
  | 'background-remover'
  | 'heic-to-jpg'
  | 'image-upscaler'
  | 'png-to-jpg'
  | 'webp-to-jpg'
  | 'image-resizer'
  | 'qr-generator'
  | 'color-palette'
  | 'word-counter'
  | 'pdf-to-word';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  slug: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  acceptedFormats: string[];
  acceptedMimeTypes: string[];
  externalUrl?: string;
}

export const TOOLS: ToolDefinition[] = [
  // Existing 6 Tools
  {
    id: 'mp4-to-mp3',
    name: 'MP4 to MP3',
    slug: 'mp4-to-mp3',
    description: 'Convert your MP4 video to MP3 audio.',
    badge: 'AUDIO',
    icon: Music,
    acceptedFormats: ['.mp4'],
    acceptedMimeTypes: ['video/mp4'],
  },
  {
    id: 'webm-to-mp4',
    name: 'WebM to MP4',
    slug: 'webm-to-mp4',
    description: 'Convert WebM video recordings into universal MP4 video.',
    badge: 'VIDEO',
    icon: Video,
    acceptedFormats: ['.webm'],
    acceptedMimeTypes: ['video/webm'],
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    description: 'Combine multiple PDF files into one single document.',
    badge: 'PDF',
    icon: Files,
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    description: 'Convert JPG images into a clean PDF document.',
    badge: 'PDF',
    icon: FileImage,
    acceptedFormats: ['.jpg', '.jpeg'],
    acceptedMimeTypes: ['image/jpeg'],
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    slug: 'pdf-to-jpg',
    description: 'Extract every page of your PDF into high-quality JPG images.',
    badge: 'IMAGE',
    icon: ImageIcon,
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
  },
  {
    id: 'compress-image',
    name: 'Compress Image',
    slug: 'compress-image',
    description: 'Reduce image file size while maintaining visual quality.',
    badge: 'OPTIMIZE',
    icon: Minimize2,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },

  // 9 New High-Demand Tools
  {
    id: 'background-remover',
    name: 'Background Remover',
    slug: 'background-remover.html',
    description: 'Remove background from any image and output transparent PNG.',
    badge: 'IMAGE',
    icon: Sparkles,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    externalUrl: '/background-remover.html',
  },
  {
    id: 'heic-to-jpg',
    name: 'HEIC to JPG',
    slug: 'heic-to-jpg.html',
    description: 'Convert Apple iPhone HEIC and HEIF photos to high quality JPG.',
    badge: 'IMAGE',
    icon: Smartphone,
    acceptedFormats: ['.heic', '.heif'],
    acceptedMimeTypes: ['image/heic', 'image/heif'],
    externalUrl: '/heic-to-jpg.html',
  },
  {
    id: 'image-upscaler',
    name: 'Image Upscaler',
    slug: 'image-upscaler.html',
    description: 'Upscale blurry images up to 4x HD using multi-pass canvas scaling.',
    badge: 'IMAGE',
    icon: Scaling,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    externalUrl: '/image-upscaler.html',
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    slug: 'png-to-jpg.html',
    description: 'Convert PNG images to JPG with white background fill option.',
    badge: 'IMAGE',
    icon: FileImage,
    acceptedFormats: ['.png'],
    acceptedMimeTypes: ['image/png'],
    externalUrl: '/png-to-jpg.html',
  },
  {
    id: 'webp-to-jpg',
    name: 'WEBP to JPG',
    slug: 'webp-to-jpg.html',
    description: 'Convert web WEBP images into universal JPG or PNG photos.',
    badge: 'IMAGE',
    icon: RefreshCw,
    acceptedFormats: ['.webp'],
    acceptedMimeTypes: ['image/webp'],
    externalUrl: '/webp-to-jpg.html',
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer.html',
    description: 'Resize for Instagram, YouTube, Facebook, and Twitter perfectly.',
    badge: 'IMAGE',
    icon: Crop,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    externalUrl: '/image-resizer.html',
  },
  {
    id: 'qr-generator',
    name: 'QR Generator',
    slug: 'qr-generator.html',
    description: 'Generate high-resolution custom QR codes completely offline.',
    badge: 'IMAGE',
    icon: QrCode,
    acceptedFormats: ['text'],
    acceptedMimeTypes: ['text/plain'],
    externalUrl: '/qr-generator.html',
  },
  {
    id: 'color-palette',
    name: 'Color Palette',
    slug: 'color-palette.html',
    description: 'Extract 5 dominant colors and copy hex codes from any image.',
    badge: 'IMAGE',
    icon: Palette,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    externalUrl: '/color-palette.html',
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: 'word-counter.html',
    description: 'Count words and characters + UPPERCASE, lowercase, and Title Case.',
    badge: 'TEXT',
    icon: FileText,
    acceptedFormats: ['text'],
    acceptedMimeTypes: ['text/plain'],
    externalUrl: '/word-counter.html',
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word - Private',
    slug: 'pdf-to-word.html',
    description: 'Convert PDF documents into editable Word (.docx) files completely offline.',
    badge: 'NEW',
    icon: FileText,
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    externalUrl: '/pdf-to-word.html',
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.id === id || tool.slug === id);
}
