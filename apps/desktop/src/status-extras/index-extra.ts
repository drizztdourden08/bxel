/* @layer renderer-app @kind logic */
import { samplePixel } from '../editor/sample-pixel';
import { EXTRA_TEXT } from './status-extras.constants';
import type { PixelRead } from './read-extras.type';
import type { StatusExtras } from './status-extras.type';

const indexExtra = (read: PixelRead): StatusExtras['index'] => {
  if (!read.target || !read.pointer) return null;
  const index = samplePixel(read.target, read.pointer);
  const slot = index === null ? undefined : read.slots[index];
  if (!slot) return null;
  return { text: EXTRA_TEXT.indexValue(slot.index, slot.name), swatch: slot.transparent ? undefined : slot.hex };
};

export { indexExtra };
