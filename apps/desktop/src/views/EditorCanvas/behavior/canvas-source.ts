/* @layer renderer-app @kind logic */
import type { PixelSource } from '../../PixelViewport/PixelViewport.type';

const canvasSource = (...layers: readonly (PixelSource | null | undefined)[]): PixelSource | undefined =>
  layers.find((layer) => layer !== null && layer !== undefined) ?? undefined;

export { canvasSource };
