import React from 'react';
import { JpgToPdfTool } from '../../src/tools/JpgToPdfTool';

export const metadata = {
  title: "Free JPG to PDF Converter - Offline, No Upload, Private | Tindry",
  description: "Free JPG to PDF Converter 100% offline in your browser. No upload, fast, private, no signup. Works instantly.",
  alternates: { canonical: "https://www.tindry.com/jpg-to-pdf" }
};

export default function JpgToPdfPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <JpgToPdfTool />
      <div className="mt-10 p-4 text-center text-xs text-gray-500 max-w-2xl mx-auto">
        🔒 100% Private: Files never leave your browser. No uploads. No waiting.
      </div>
    </div>
  );
}
