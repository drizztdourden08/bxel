/* @layer renderer-app @kind logic */
import { findBank, flattenFrame } from '@bxel/document';
import type { Artwork, PaletteBank, Sprite } from '@bxel/document';
import { bankTable } from '../editor/bank-table';
import { PALETTE_TEXT } from '../editor/palette-text.constants';
import { paintIndices } from '../image-import/paint-indices';
import { framesText } from './frames-text';
import { CHANGE_TEXT } from './palette-change.constants';
import type { ChangePicture, ChangePreview, ChangeRequest } from './palette-change.type';

const highestIndex = (sprite: Sprite): number => {
  let highest = 0;
  for (const cel of Object.values(sprite.cels)) for (const value of cel.pixels) if (value > highest) highest = value;
  return highest;
};

const pictureOf = (sprite: Sprite, from: PaletteBank, to: PaletteBank): ChangePicture | null => {
  const frame = sprite.frames[0];
  if (!frame) return null;
  const indices = flattenFrame(sprite, frame.id);
  const { width, height } = sprite;
  return {
    spriteName: sprite.name,
    before: { data: paintIndices(indices, bankTable(from)), width, height },
    after: { data: paintIndices(indices, bankTable(to)), width, height },
  };
};

const issueOf = (sprite: Sprite, from: PaletteBank, to: PaletteBank | undefined): string | null => {
  if (!to) return CHANGE_TEXT.choosePalette;
  if (to.id === from.id) return CHANGE_TEXT.samePalette(to.name);
  return highestIndex(sprite) >= to.slots.length ? CHANGE_TEXT.fewer(to.name, highestIndex(sprite) + 1) : null;
};

const switchPreview = (artwork: Artwork, bank: PaletteBank, request: ChangeRequest): ChangePreview | null => {
  const sprite = artwork.sprites.find((each) => each.id === request.spriteId);
  if (!sprite) return null;
  const dest = request.toBankId === undefined ? undefined : findBank(artwork, request.toBankId);
  return {
    swatchLine: '',
    bankName: dest?.name ?? bank.name,
    affected: [{ id: sprite.id, name: sprite.name, frames: framesText(sprite.frames.map((_, at) => at + 1)), pixels: 0 }],
    totalSprites: artwork.sprites.length,
    pixels: 0,
    picture: dest ? pictureOf(sprite, bank, dest) : null,
    countBefore: PALETTE_TEXT.count(bank.cap, bank.transparent),
    countAfter: dest ? PALETTE_TEXT.count(dest.cap, dest.transparent) : '',
    error: issueOf(sprite, bank, dest),
  };
};

export { switchPreview };
