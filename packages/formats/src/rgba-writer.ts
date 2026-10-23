/* @layer core @kind logic */
import type { ExpandContext, PixelWriter } from './png-decode.type';
import { sampleByte } from './sample-byte';

const rgbaWriter = (context: ExpandContext): PixelWriter => {
  const { data, header } = context;
  return (row, x, out, at) => {
    for (let c = 0; c < 4; c += 1) {
      out[at + c] = sampleByte(data, row, x * 4 + c, header.bitDepth);
    }
    return true;
  };
};

export { rgbaWriter };
