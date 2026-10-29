/* @layer renderer-app @kind logic */
import type { Sheet, SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import type { AlignBox } from './align.type';

const alignBoxes = (sheet: Sheet, ids: readonly SpriteId[]): AlignBox[] => {
  const sprites = currentArtwork()?.sprites ?? [];
  return sheet.entries.flatMap((entry) => {
    const sprite = ids.includes(entry.spriteId) ? sprites.find((each) => each.id === entry.spriteId) : undefined;
    return sprite ? [{ id: sprite.id, x: entry.at.x, y: entry.at.y, width: sprite.width, height: sprite.height }] : [];
  });
};

export { alignBoxes };
