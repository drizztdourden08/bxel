/* @layer tests @kind helper */
type ListedChunk = { readonly type: string; readonly data: Uint8Array };

const listChunks = (png: Uint8Array): ListedChunk[] => {
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  const chunks: ListedChunk[] = [];
  let offset = 8;
  while (offset < png.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...png.subarray(offset + 4, offset + 8));
    chunks.push({ type, data: png.subarray(offset + 8, offset + 8 + length) });
    offset += length + 12;
  }
  return chunks;
};

export { listChunks };
