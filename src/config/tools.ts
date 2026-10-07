import { 
  Music, 
  Files, 
  FileImage, 
  Image as ImageIcon, 
  Minimize2, 
  LucideIcon 
} from 'lucide-react';

export type ToolId = 'mp4-to-mp3' | 'merge-pdf' | 'jpg-to-pdf' | 'pdf-to-jpg' | 'compress-image';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  slug: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  acceptedFormats: string[];
  acceptedMimeTypes: string[];
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'mp4-to-mp3',
    name: 'MP4 to MP3',
    slug: 'mp4-to-mp3',
    description: 'Convert your MP4 video to MP3 audio.',
    badge: 'Audio',
    icon: Music,
    acceptedFormats: ['.mp4'],
    acceptedMimeTypes: ['video/mp4'],
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
    badge: 'Image',
    icon: ImageIcon,
    acceptedFormats: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
  },
  {
    id: 'compress-image',
    name: 'Compress Image',
    slug: 'compress-image',
    description: 'Reduce image file size while maintaining visual quality.',
    badge: 'Optimize',
    icon: Minimize2,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.id === id || tool.slug === id);
}
