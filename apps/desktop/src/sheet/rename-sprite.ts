/* @layer renderer-app @kind logic */
import { COMMAND_NAME, nameKey } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentArtwork } from './current-artwork';
import { runDocument } from './run-document';
import { SPRITE_LABEL, SPRITE_TEXT } from './sprite-label.constants';
import { spritesTarget } from './sprites-target';

const renameSprite = (id: SpriteId, name: string): boolean => {
  const artwork = currentArtwork();
  if (!artwork) return false;
  const current = artwork.sprites.find((sprite) => sprite.id === id);
  const next = name.trim();
  if (!current || next === current.name) return true;
  if (artwork.sprites.some((sprite) => sprite.id !== id && nameKey(sprite.name) === nameKey(next))) {
    useNoticeStore.getState().post(SPRITE_TEXT.taken(next));
    return false;
  }
  const step = { name: COMMAND_NAME.spriteUpdate, targets: spritesTarget([id]), options: { name: next } };
  return runDocument(SPRITE_LABEL.rename, [step]) !== null;
};

export { renameSprite };
