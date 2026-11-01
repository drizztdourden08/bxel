/* @layer renderer-app @kind types */
import type { PixelWheel } from '../PixelViewport.type';

interface WheelOptions {
  mode: PixelWheel;
  altSteps?: (steps: number) => void;
}

export type { WheelOptions };
