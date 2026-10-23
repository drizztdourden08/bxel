/* @layer core @kind logic */
import type { ExpandContext, PixelWriter } from './png-decode.type';
import { sampleByte } from './sample-byte';

const grayAlphaWriter = (context: ExpandContext): PixelWriter => {
  const { data, header } = context;
  return (row, x, out, at) => {
    const value = sampleByte(data, row, x * 2, header.bitDepth);
    out[at] = value;
    out[at + 1] = value;
    out[at + 2] = value;
    out[at + 3] = sampleByte(data, row, x * 2 + 1, header.bitDepth);
    return true;
  };
};

export { grayAlphaWriter };
