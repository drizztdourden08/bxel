/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { chooseSprites } from './choose-sprites';
import { currentArtwork } from './current-artwork';
import { runDocument } from './run-document';
import { SPRITE_LABEL } from './sprite-label.constants';
import { spritesTarget } from './sprites-target';

const duplicateSprites = (ids: readonly SpriteId[]): void => {
  const before = new Set(currentArtwork()?.sprites.map((sprite) => sprite.id));
  if (ids.length === 0) return;
  const step = { name: COMMAND_NAME.spriteDuplicate, targets: spritesTarget(ids), options: {} };
  if (runDocument(SPRITE_LABEL.duplicate(ids.length), [step]) === null) return;
  const made = (currentArtwork()?.sprites ?? []).filter((sprite) => !before.has(sprite.id)).map((sprite) => sprite.id);
  chooseSprites({ selected: made, anchor: made[0] ?? null, active: made[0] ?? null });
};

export { duplicateSprites };
