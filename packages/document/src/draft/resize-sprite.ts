/* @layer core @kind logic */
import { recordPending } from '../history/record-pending';
import type { CelId, SpriteId } from '../model/ids.type';
import type { Cel } from '../model/sprite.type';
import { requireSprite } from '../read/require-sprite';
import { checkGeometry } from './check-geometry';
import { clipGuides } from './clip-guides';
import type { Draft } from './draft.type';
import type { SpriteGeometry } from './resize-sprite.type';
import { snapshotOwned } from './snapshot-owned';
import { updateSprite } from './update-sprite';

const celsOf = (draft: Draft, geometry: SpriteGeometry): Record<CelId, Cel> => {
  const cels: Record<CelId, Cel> = {};
  for (const [key, pixels] of Object.entries(geometry.cels)) {
    const id = key as CelId;
    draft.owned.delete(id);
    draft.baselines.delete(id);
    cels[id] = { id, pixels };
  }
  return cels;
};

const resizeSprite = (draft: Draft, spriteId: SpriteId, geometry: SpriteGeometry): void => {
  checkGeometry(requireSprite(draft.artwork, spriteId), geometry);
  recordPending(draft);
  snapshotOwned(draft);
  const cels = celsOf(draft, geometry);
  updateSprite(draft, spriteId, (sprite) =>
    clipGuides(
      { ...sprite, width: geometry.width, height: geometry.height, pivot: geometry.pivot, slices: geometry.slices ?? sprite.slices, cels },
      geometry,
    ),
  );
  recordPending(draft);
};

export { resizeSprite };
