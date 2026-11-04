import React from 'react';
import { Mp4ToMp3Tool } from '../../src/tools/Mp4ToMp3Tool';

export const metadata = {
  title: "Free MP4 to MP3 Converter - Offline, No Upload, Private | Tindry",
  description: "Free MP4 to MP3 Converter 100% offline in your browser. No upload, fast, private, no signup. Works instantly.",
  alternates: { canonical: "https://www.tindry.com/mp4-to-mp3" }
};

export default function Mp4ToMp3Page() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <Mp4ToMp3Tool />
      <div className="mt-8 text-center text-xs text-neutral-500">
        <p>100% private, offline MP4 to MP3 audio extraction. Your files never leave your device.</p>
      </div>
    </div>
  );
}
