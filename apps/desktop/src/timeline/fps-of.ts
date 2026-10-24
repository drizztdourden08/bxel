/* @layer renderer-app @kind logic */
import type { FrameId, Sprite } from '@bxel/document';

const fpsOf = (sprite: Sprite, ids: readonly FrameId[]): number => {
  const durations = new Map(sprite.frames.map((frame) => [frame.id, frame.durationMs]));
  const total = ids.reduce((sum, id) => sum + (durations.get(id) ?? 0), 0);
  return total === 0 ? 0 : Math.round((1000 * ids.length * 10) / total) / 10;
};

export { fpsOf };
