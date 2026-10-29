/* @layer core @kind logic */
import type { SavedRun } from '@bxel/document';
import type { MaskView } from '../buffer.type';
import type { Size } from '../geometry.type';
import { maskFromSpans } from './mask-from-spans';

const runsMask = (size: Size, runs: readonly SavedRun[]): MaskView =>
  maskFromSpans(size, runs.map(([y, x0, x1]) => ({ y, x0, x1 })));

export { runsMask };
