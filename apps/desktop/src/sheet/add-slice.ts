/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Rect, SpriteId } from '@bxel/document';
import { currentArtwork } from './current-artwork';
import { freeName } from './free-name';
import { runDocument } from './run-document';
import { SLICE_NAME } from './sheet.constants';
import { SPRITE_LABEL } from './sprite-label.constants';
import { spritesTarget } from './sprites-target';

const addSlice = (spriteId: SpriteId, rect: Rect): boolean => {
  const sprite = currentArtwork()?.sprites.find((each) => each.id === spriteId);
  if (!sprite || rect.width < 1 || rect.height < 1) return false;
  const name = freeName(SLICE_NAME, sprite.slices.map((slice) => slice.name));
  const step = { name: COMMAND_NAME.sliceAdd, targets: spritesTarget([spriteId]), options: { name, rect } };
  return runDocument(SPRITE_LABEL.slice, [step]) !== null;
};

export { addSlice };
