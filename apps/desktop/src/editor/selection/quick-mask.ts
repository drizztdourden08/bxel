/* @layer renderer-app @kind logic */
import { paintStroke } from '@bxel/raster';
import type { MaskView, Point, Size } from '@bxel/raster';
import type { ToolSettings } from '../../stores/tool-store.type';
import { brushOf } from '../brush-of';
import { symmetryOf } from '../symmetry-of';
import { mergeMask } from './merge-mask';

const PAINTED = 1;

const stampQuickMask = (scratch: Uint8Array, size: Size, points: readonly Point[], settings: ToolSettings): void => {
  paintStroke({
    target: { pixels: scratch, width: size.width, height: size.height },
    index: PAINTED,
    points,
    brush: brushOf(settings),
    pixelPerfect: false,
    symmetry: symmetryOf(settings, size),
  });
};

const quickMaskResult = (base: MaskView | null, scratch: Uint8Array, size: Size, erase: boolean): MaskView => {
  const painted: MaskView = { bits: scratch.slice(), width: size.width, height: size.height };
  return mergeMask(base, painted, erase ? 'subtract' : 'add') ?? { bits: new Uint8Array(size.width * size.height), width: size.width, height: size.height };
};

export { quickMaskResult, stampQuickMask };
