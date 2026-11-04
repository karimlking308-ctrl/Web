import React from 'react';
import { WebmToMp4Tool } from '../../src/tools/WebmToMp4Tool';

export const metadata = {
  title: "Free WebM to MP4 Converter - Offline, No Upload, Private | Tindry",
  description: "Free WebM to MP4 Converter 100% offline in your browser. No upload, fast, private, no signup. Works instantly.",
  alternates: { canonical: "https://www.tindry.com/webm-to-mp4" }
};

export default function WebmToMp4Page() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <WebmToMp4Tool />
      <div className="mt-8 text-center text-xs text-neutral-500">
        <p>100% private WebM to MP4 video conversion. Fast and offline, files never leave your browser.</p>
      </div>
    </div>
  );
}
