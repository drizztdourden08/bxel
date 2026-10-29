/* @layer renderer-app @kind logic */
import type { ScreenPoint } from './leash.type';

const leash = (held: ScreenPoint | null, pointer: ScreenPoint, reach: number): ScreenPoint => {
  if (!held) return pointer;
  const dx = pointer.x - held.x;
  const dy = pointer.y - held.y;
  const gap = Math.hypot(dx, dy);
  if (gap <= reach) return held;
  const pull = (gap - reach) / gap;
  return { x: held.x + dx * pull, y: held.y + dy * pull };
};

export { leash };
