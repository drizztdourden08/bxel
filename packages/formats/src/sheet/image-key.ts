/* @layer core @kind logic */
import { IMAGE_KEY_DECODER } from './image-key.constants';
import type { TrimmedImage } from './sheet.type';

const imageKey = ({ image, offsetX, offsetY, sourceWidth, sourceHeight }: TrimmedImage): string =>
  `${image.width}x${image.height}:${offsetX},${offsetY}:${sourceWidth}x${sourceHeight}:${IMAGE_KEY_DECODER.decode(
    new Uint8Array(image.data.buffer, image.data.byteOffset, image.data.byteLength),
  )}`;

export { imageKey };
