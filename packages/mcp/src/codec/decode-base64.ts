/* @layer core @kind logic */
import { BASE64_LOOKUP, BASE64_PADDING, BASE64_SHAPE } from './base64.constants';
import { encodeBase64 } from './encode-base64';

const sextetsOf = (group: string): number =>
  [...group].reduce((chunk, character) => (chunk << 6) | (BASE64_LOOKUP.get(character) ?? 0), 0);

const decodeBase64 = (text: string): Uint8Array | null => {
  if (!BASE64_SHAPE.test(text)) return null;
  const padding = text.length - text.replace(/=+$/, '').length;
  const bytes = new Uint8Array((text.length / 4) * 3 - padding);
  for (let group = 0; group < text.length / 4; group += 1) {
    const chunk = sextetsOf(text.slice(group * 4, group * 4 + 4).replaceAll(BASE64_PADDING, 'A'));
    for (let offset = 0; offset < 3; offset += 1) {
      const position = group * 3 + offset;
      if (position < bytes.length) bytes[position] = (chunk >> (16 - offset * 8)) & 255;
    }
  }
  return encodeBase64(bytes) === text ? bytes : null;
};

export { decodeBase64 };
