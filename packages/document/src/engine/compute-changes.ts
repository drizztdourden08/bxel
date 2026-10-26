/* @layer core @kind logic */
import type { ChangeSet } from '../commands/result.type';
import type { Artwork } from '../model/artwork.type';
import { diffEntities } from './diff-entities';
import { diffSprites } from './diff-sprites';

const computeChanges = (before: Artwork, after: Artwork): ChangeSet => ({
  artwork:
    before.name !== after.name ||
    before.defaultBankId !== after.defaultBankId ||
    before.coverSpriteId !== after.coverSpriteId ||
    before.platformId !== after.platformId ||
    before.platformStrict !== after.platformStrict,
  banks: diffEntities(before.banks, after.banks),
  sprites: diffSprites(before, after),
  sheets: diffEntities(before.sheets, after.sheets),
  presets: diffEntities(before.presets, after.presets),
  tilesets: diffEntities(before.tilesets, after.tilesets),
  tilemaps: diffEntities(before.tilemaps, after.tilemaps),
  animations: diffEntities(before.animations, after.animations),
});

export { computeChanges };
