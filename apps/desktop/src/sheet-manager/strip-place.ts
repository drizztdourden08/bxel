/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { boundSheetId } from './bound-sheet';
import type { StripPlace } from './cut-strip-steps';

/** Where the sprite sits on the sheet of the open tab, so a strip cut from it can take its place. */
const stripPlace = (sprite: SpriteId): StripPlace | null => {
  const id = boundSheetId();
  const sheet = currentArtwork()?.sheets.find((each) => each.id === id);
  const entry = sheet?.entries.find((each) => each.spriteId === sprite);
  return sheet && entry ? { sheet, at: entry.at } : null;
};

export { stripPlace };
