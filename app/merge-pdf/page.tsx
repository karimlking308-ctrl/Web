import React from 'react';
import { MergePdfTool } from '../../src/tools/MergePdfTool';

export const metadata = {
  title: "Free Merge PDF - Offline, No Upload, Private | Tindry",
  description: "Free Merge PDF 100% offline in your browser. No upload, fast, private, no signup. Works instantly.",
  alternates: { canonical: "https://www.tindry.com/merge-pdf" }
};

export default function MergePdfPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <MergePdfTool />
      <div className="mt-8 text-center text-xs text-neutral-500">
        <p>100% private, offline PDF merging. Your documents stay safe on your device.</p>
      </div>
    </div>
  );
}
