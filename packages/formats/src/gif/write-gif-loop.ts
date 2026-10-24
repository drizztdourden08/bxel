/* @layer core @kind logic */
import { GIF_BLOCK } from './gif-block.constants';
import { GIF_NETSCAPE } from './gif-netscape.constants';
import { writeU16Le } from './write-u16-le';

const writeGifLoop = (loops: number): Uint8Array => {
  if (loops === 1) return new Uint8Array(0);
  const out = new Uint8Array(19);
  out[0] = GIF_BLOCK.EXTENSION;
  out[1] = GIF_BLOCK.APPLICATION;
  out[2] = GIF_NETSCAPE.length;
  out.set(GIF_NETSCAPE, 3);
  out[14] = 3;
  out[15] = 1;
  writeU16Le(out, 16, loops === 0 ? 0 : loops - 1);
  return out;
};

export { writeGifLoop };
