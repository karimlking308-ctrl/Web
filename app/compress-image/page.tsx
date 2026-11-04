import React from 'react';
import { CompressImageTool } from '../../src/tools/CompressImageTool';

export const metadata = {
  title: "Free Image Compressor - Offline, No Upload, Private | Tindry",
  description: "Free Image Compressor 100% offline in your browser. No upload, fast, private, no signup. Works instantly.",
  alternates: { canonical: "https://www.tindry.com/compress-image" }
};

export default function CompressImagePage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <CompressImageTool />
      <div className="mt-8 text-center text-xs text-neutral-500">
        <p>100% private, offline image compression in your browser with no quality loss.</p>
      </div>
    </div>
  );
}
