/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { chooseSprites } from '../sheet/choose-sprites';
import { currentArtwork } from '../sheet/current-artwork';

const selectMade = (before: ReadonlySet<SpriteId>): void => {
  const made = (currentArtwork()?.sprites ?? []).filter((sprite) => sprite.role === 'sprite' && !before.has(sprite.id)).map((sprite) => sprite.id);
  if (made.length > 0) chooseSprites({ selected: made, anchor: made[0] ?? null, active: made[0] ?? null });
};

export { selectMade };
