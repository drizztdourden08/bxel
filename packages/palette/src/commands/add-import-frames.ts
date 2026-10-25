/* @layer core @kind logic */
import { insertFrame, replaceFrame, requireSprite } from '@bxel/document';
import type { Draft, FrameId, PaletteBank, SpriteId } from '@bxel/document';
import { mapImportImage } from './map-import-image';
import type { SpriteImportOptions } from './sprite-import.type';
import { writeImportCel } from './write-import-cel';

const setFirstDuration = (draft: Draft, spriteId: SpriteId, durationMs: number | undefined): void => {
  const first = requireSprite(draft.artwork, spriteId).frames[0];
  if (durationMs !== undefined && first && first.durationMs !== durationMs) {
    replaceFrame(draft, spriteId, { ...first, durationMs });
  }
};

const addImportFrames = (draft: Draft, spriteId: SpriteId, bank: PaletteBank, options: SpriteImportOptions): void => {
  setFirstDuration(draft, spriteId, options.durationMs);
  const { width, height } = options.image;
  for (const extra of options.frames) {
    const frame = { id: draft.ids.next('frm') as FrameId, durationMs: extra.durationMs };
    const at = requireSprite(draft.artwork, spriteId).frames.length;
    insertFrame(draft, { spriteId, frame, at });
    const pixels = mapImportImage({ width, height, rgba: extra.rgba }, bank, options.mapping);
    writeImportCel(draft, requireSprite(draft.artwork, spriteId), pixels, at);
  }
};

export { addImportFrames };
