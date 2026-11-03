/* @layer renderer-app @kind logic */
import type { KeepInput } from './kept-canvas.type';

const keptCanvas = <Canvas>({ kept, key, sprite, bank, limit, make }: KeepInput<Canvas>): Canvas => {
  const hit = kept.get(key);
  if (hit?.sprite === sprite && hit.bank === bank) return hit.canvas;
  const canvas = make();
  kept.delete(key);
  kept.set(key, { sprite, bank, canvas });
  if (kept.size > limit) {
    const oldest = kept.keys().next().value;
    if (oldest !== undefined) kept.delete(oldest);
  }
  return canvas;
};

export { keptCanvas };
