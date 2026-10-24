/* @layer renderer-app @kind logic */
import { DATA_URL_CHUNK } from './export.constants';

const toDataUrl = (bytes: Uint8Array, mime: string): string => {
  let text = '';
  for (let at = 0; at < bytes.length; at += DATA_URL_CHUNK) {
    text += String.fromCharCode(...bytes.subarray(at, at + DATA_URL_CHUNK));
  }
  return `data:${mime};base64,${btoa(text)}`;
};

export { toDataUrl };
