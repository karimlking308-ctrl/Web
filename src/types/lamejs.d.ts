declare module '@breezystack/lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, samplerate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }
  export const WavHeader: any;
  const defaultExport: {
    Mp3Encoder: typeof Mp3Encoder;
    WavHeader: any;
  };
  export default defaultExport;
}
