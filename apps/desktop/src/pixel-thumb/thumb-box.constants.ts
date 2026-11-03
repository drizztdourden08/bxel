/* @layer renderer-app @kind constants */
import type { PixelThumbnailBox } from '@drizztdourden08/tessera';

const THUMB_BOXES: readonly Exclude<PixelThumbnailBox, 'fluid'>[] = [64, 48, 40, 32, 24, 16];

const SMALLEST_THUMB_BOX: PixelThumbnailBox = 16;

export { SMALLEST_THUMB_BOX, THUMB_BOXES };
