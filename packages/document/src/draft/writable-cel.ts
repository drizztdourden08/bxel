/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { CelId, SpriteId } from '../model/ids.type';
import { requireSprite } from '../read/require-sprite';
import type { Draft } from './draft.type';
import { updateSprite } from './update-sprite';

const writableCel = (draft: Draft, spriteId: SpriteId, celId: CelId): Uint8Array => {
  const owned = draft.owned.get(celId);
  if (owned) return owned;
  const cel = requireSprite(draft.artwork, spriteId).cels[celId];
  if (!cel) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Cel ${celId} does not exist in sprite ${spriteId}.`);
  const pixels = cel.pixels.slice();
  draft.owned.set(celId, pixels);
  updateSprite(draft, spriteId, (sprite) => ({ ...sprite, cels: { ...sprite.cels, [celId]: { ...cel, pixels } } }));
  return pixels;
};

export { writableCel };
