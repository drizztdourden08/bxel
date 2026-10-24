/* @layer core @kind logic */
import type { SpriteChange } from '../commands/result.type';
import type { Artwork } from '../model/artwork.type';
import { recoloredBanks } from './recolored-banks';
import { spriteChange } from './sprite-change';

const diffSprites = (before: Artwork, after: Artwork): SpriteChange[] => {
  const recolored = recoloredBanks(before, after);
  const prior = new Map(before.sprites.map((sprite) => [sprite.id, sprite] as const));
  const present = new Set(after.sprites.map((sprite) => sprite.id));
  const changes: SpriteChange[] = [];
  for (const sprite of after.sprites) {
    const change = spriteChange({ before: prior.get(sprite.id), after: sprite, recolored: recolored.has(sprite.bankId) });
    if (change) changes.push(change);
  }
  for (const sprite of before.sprites) {
    if (!present.has(sprite.id)) {
      changes.push({ id: sprite.id, kind: 'removed', meta: true, structure: true, recolored: false, cels: [] });
    }
  }
  return changes;
};

export { diffSprites };
