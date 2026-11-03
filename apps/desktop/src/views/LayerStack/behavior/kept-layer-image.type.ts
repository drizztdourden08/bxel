/* @layer renderer-app @kind types */
import type { FrameImage } from '../../../sheet/sheet.type';

interface KeptLayerImage {
  bank: object | null;
  width: number;
  height: number;
  stroke: number;
  live: object | null;
  image: FrameImage;
}

export type { KeptLayerImage };
