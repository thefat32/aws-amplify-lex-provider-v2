import pako from 'pako';
import { base64ToArrayBuffer } from './base64';

export const unGzipBase64AsJson = <T>(gzipBase64: string): T => {
  return JSON.parse(
    pako.ungzip(base64ToArrayBuffer(gzipBase64), { to: 'string' })
  ) as T;
};
