/* @layer renderer-app @kind logic */
import type { PixelThumbnailBox } from '@drizztdourden08/tessera';
import { SMALLEST_THUMB_BOX, THUMB_BOXES } from './thumb-box.constants';

const thumbBox = (size: number): PixelThumbnailBox => THUMB_BOXES.find((box) => box <= size) ?? SMALLEST_THUMB_BOX;

export { thumbBox };
