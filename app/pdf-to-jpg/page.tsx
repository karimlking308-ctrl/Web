import React from 'react';
import { PdfToJpgTool } from '../../src/tools/PdfToJpgTool';

export const metadata = {
  title: "Free PDF to JPG Converter - Offline, No Upload, Private | Tindry",
  description: "Free PDF to JPG Converter 100% offline in your browser. No upload, fast, private, no signup. Works instantly.",
  alternates: { canonical: "https://www.tindry.com/pdf-to-jpg" }
};

export default function PdfToJpgPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <PdfToJpgTool />
      <div className="mt-10 p-4 text-center text-xs text-gray-500 max-w-2xl mx-auto">
        🔒 100% Private: Files never leave your browser. No uploads. No waiting.
      </div>
    </div>
  );
}
