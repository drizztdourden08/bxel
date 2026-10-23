/* @layer core @kind logic */
import type { ExpandContext, PixelWriter } from './png-decode.type';
import { readSample } from './read-sample';
import { sampleByte } from './sample-byte';

const grayWriter = (context: ExpandContext): PixelWriter => {
  const { data, header, trns } = context;
  const key = trns && trns.length >= 2 ? ((trns[0] ?? 0) << 8) | (trns[1] ?? 0) : -1;
  return (row, x, out, at) => {
    const value = sampleByte(data, row, x, header.bitDepth);
    out[at] = value;
    out[at + 1] = value;
    out[at + 2] = value;
    out[at + 3] = readSample(data, row, x, header.bitDepth) === key ? 0 : 255;
    return true;
  };
};

export { grayWriter };
