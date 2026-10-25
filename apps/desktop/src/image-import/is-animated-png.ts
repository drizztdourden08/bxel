/* @layer renderer-app @kind logic */
import { CHUNK_FRAME_BYTES, CHUNK_HEAD_BYTES, CHUNK_TYPE, PNG_HEADER_BYTES } from './animated-image.constants';

const typeAt = (bytes: Uint8Array, at: number): string => String.fromCharCode(...bytes.subarray(at + 4, at + CHUNK_HEAD_BYTES));

const isAnimatedPng = (bytes: Uint8Array): boolean => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let at = PNG_HEADER_BYTES;
  while (at + CHUNK_HEAD_BYTES <= bytes.length) {
    const type = typeAt(bytes, at);
    if (type === CHUNK_TYPE.control) return true;
    if (type === CHUNK_TYPE.data) return false;
    at += CHUNK_FRAME_BYTES + view.getUint32(at);
  }
  return false;
};

export { isAnimatedPng };
