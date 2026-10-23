/* @layer core @kind logic */
import type { ExpandContext, PixelWriter } from './png-decode.type';
import { readSample } from './read-sample';

const indexedWriter = (context: ExpandContext): PixelWriter => {
  const { data, header, plte, trns } = context;
  const entries = plte ? Math.floor(plte.length / 3) : 0;
  return (row, x, out, at) => {
    const index = readSample(data, row, x, header.bitDepth);
    if (!plte || index >= entries) return false;
    out[at] = plte[index * 3] ?? 0;
    out[at + 1] = plte[index * 3 + 1] ?? 0;
    out[at + 2] = plte[index * 3 + 2] ?? 0;
    out[at + 3] = trns?.[index] ?? 255;
    return true;
  };
};

export { indexedWriter };
