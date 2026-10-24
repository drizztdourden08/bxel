/* @layer core @kind logic */
import { BASE64_ALPHABET, BASE64_PADDING, BASE64_SEXTET_MASK } from './base64.constants';

const groupToText = (bytes: Uint8Array, start: number): string => {
  const available = Math.min(3, bytes.length - start);
  const chunk = ((bytes[start] ?? 0) << 16) | ((bytes[start + 1] ?? 0) << 8) | (bytes[start + 2] ?? 0);
  const letters = [18, 12, 6, 0].map((shift) => BASE64_ALPHABET.charAt((chunk >> shift) & BASE64_SEXTET_MASK));
  return letters.slice(0, available + 1).join('') + BASE64_PADDING.repeat(3 - available);
};

const encodeBase64 = (bytes: Uint8Array): string => {
  const groups: string[] = [];
  for (let start = 0; start < bytes.length; start += 3) groups.push(groupToText(bytes, start));
  return groups.join('');
};

export { encodeBase64 };
