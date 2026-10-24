/* @layer core @kind logic */
import type { CelId, SpriteId } from '../model/ids.type';
import type { Draft } from './draft.type';
import { updateSprite } from './update-sprite';

const addCel = (draft: Draft, spriteId: SpriteId, pixels: Uint8Array): CelId => {
  const celId = draft.ids.next('cel') as CelId;
  updateSprite(draft, spriteId, (sprite) => ({ ...sprite, cels: { ...sprite.cels, [celId]: { id: celId, pixels } } }));
  return celId;
};

export { addCel };
