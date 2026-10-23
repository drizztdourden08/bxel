/* @layer renderer-app @kind test */
const LOCAL_HEADER_BYTES = 30;
const NAME_LENGTH_AT = 26;
const EXTRA_LENGTH_AT = 28;

const indexOfText = (bytes: Uint8Array, text: string): number => {
  const needle = new TextEncoder().encode(text);
  return bytes.findIndex((_, start) => needle.every((value, offset) => bytes[start + offset] === value));
};

const damageCel = (bytes: Uint8Array): Uint8Array => {
  const copy = bytes.slice();
  const nameAt = indexOfText(copy, 'cels/');
  if (nameAt < 0) throw new Error('the archive has no cel entry');
  const header = new DataView(copy.buffer, nameAt - LOCAL_HEADER_BYTES, LOCAL_HEADER_BYTES);
  const dataAt = nameAt + header.getUint16(NAME_LENGTH_AT, true) + header.getUint16(EXTRA_LENGTH_AT, true);
  copy[dataAt] = (copy[dataAt] ?? 0) ^ 0xff;
  return copy;
};

export { damageCel };
