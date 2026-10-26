/* @layer core @kind logic */
import type { TilePlayback, TileSeed } from './tile-playback.type';
import { tileStartOffset } from './tile-start-offset';

const tileStepAt = (playback: TilePlayback, nowMs: number, seed: TileSeed | null = null): number => {
  const { cycleMs, ends, start } = playback;
  if (cycleMs <= 0) return 0;
  const offset = start === 'random' && seed ? tileStartOffset(seed, cycleMs) : 0;
  const at = (nowMs + offset) % cycleMs;
  const found = ends.findIndex((end) => at < end);
  return found < 0 ? 0 : found;
};

export { tileStepAt };
