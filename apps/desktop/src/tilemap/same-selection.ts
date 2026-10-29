/* @layer renderer-app @kind logic */
import type { MapSelection } from '../stores/tilemap-store.type';

const sameSelection = (one: MapSelection | null, two: MapSelection | null): boolean => {
  if (one === null || two === null) return one === two;
  const same = one.rect.x === two.rect.x && one.rect.y === two.rect.y && one.rect.width === two.rect.width && one.rect.height === two.rect.height;
  if (!same) return false;
  if (one.mask === null || two.mask === null) return one.mask === two.mask;
  return one.mask.length === two.mask.length && one.mask.every((bit, at) => bit === two.mask?.[at]);
};

export { sameSelection };
