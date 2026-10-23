/* @layer core @kind logic */
import { findSprite, requireSprite, updateSprite } from '@bxel/document';
import type { Cel, Draft, SpriteId } from '@bxel/document';
import type { Orientation } from '../transform/transform.type';
import { transformBuffer } from '../transform/transform-buffer';
import { reorientSprite } from './reorient-sprite';
import { CEL_ENTITY_PREFIX } from './transform-commands.constants';

const turnCel = (draft: Draft, spriteId: SpriteId, cel: Cel, orientation: Orientation): Cel => {
  const { width, height } = requireSprite(draft.project, spriteId);
  const turned: Cel = { id: cel.id, pixels: transformBuffer({ pixels: cel.pixels, width, height }, orientation).pixels };
  const prior = findSprite(draft.base, spriteId)?.cels[cel.id];
  draft.owned.delete(cel.id);
  draft.baselines.set(cel.id, turned.pixels);
  if (prior) {
    draft.ops.push({ kind: 'entity', path: `${CEL_ENTITY_PREFIX}${spriteId}:${cel.id}`, before: prior, after: turned });
  }
  return turned;
};

const turnSprite = (draft: Draft, spriteId: SpriteId, orientation: Orientation): void => {
  const sprite = requireSprite(draft.project, spriteId);
  const cels = Object.fromEntries(
    Object.values(sprite.cels).map((cel) => [cel.id, turnCel(draft, spriteId, cel, orientation)] as const),
  );
  updateSprite(draft, spriteId, (current) => ({ ...reorientSprite(current, orientation), cels }));
};

export { turnSprite };
