/* @layer core @kind logic */
import type { AreaRect } from '../model/area.type';

const areaUsage = (
  buffer: ArrayLike<number>,
  stride: number,
  rect: AreaRect,
  keyOf: (index: number) => number | null,
): number => {
  const keys = new Set<number>();
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      const key = keyOf(buffer[y * stride + x] ?? 0);
      if (key !== null) keys.add(key);
    }
  }
  return keys.size;
};

export { areaUsage };
