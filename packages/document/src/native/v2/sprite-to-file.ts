/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { SpriteFileJson } from './sprite-file.type';
import { spriteShell } from './sprite-shell';

const spriteToFile = (slice: AssetSlice): SpriteFileJson => {
  const { sprites = [], banks = [], presets = [] } = slice.artwork;
  const [sprite] = sprites;
  if (sprites.length !== 1 || !sprite) throw new Error('A sprite file holds exactly one sprite.');
  const palette = banks.find((bank) => bank.id === sprite.bankId);
  if (!palette) throw new Error(`A sprite file needs a copy of its palette ${sprite.bankId}.`);
  return { sprite: spriteShell(sprite), palette, presets };
};

export { spriteToFile };
