/* @layer core @kind logic */
import type { ExpandContext, PixelWriter } from './png-decode.type';
import { readSample } from './read-sample';
import { sampleByte } from './sample-byte';

const rgbWriter = (context: ExpandContext): PixelWriter => {
  const { data, header, trns } = context;
  const key =
    trns && trns.length >= 6
      ? [0, 2, 4].map((at) => ((trns[at] ?? 0) << 8) | (trns[at + 1] ?? 0))
      : [];
  return (row, x, out, at) => {
    let keyed = key.length === 3;
    for (let c = 0; c < 3; c += 1) {
      out[at + c] = sampleByte(data, row, x * 3 + c, header.bitDepth);
      if (readSample(data, row, x * 3 + c, header.bitDepth) !== key[c]) keyed = false;
    }
    out[at + 3] = keyed ? 0 : 255;
    return true;
  };
};

export { rgbWriter };
