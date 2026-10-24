/* @layer renderer-app @kind logic */
import type { ImageExtent } from '../../../image-import/image-import.type';
import { SLICE_PAINT } from '../ImportWizard.constants';

const sliceScale = (image: ImageExtent): number => Math.max(1, Math.floor(SLICE_PAINT.maxSide / Math.max(image.width, image.height, 1)));

export { sliceScale };
