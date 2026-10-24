/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import { COLLECTION_KEYS, COLLECTION_PREFIX, META_PATH } from './entity-path.constants';
import type { ArtworkMeta, UndoOp } from './history.type';

const sameList = (first: readonly unknown[], second: readonly unknown[]): boolean =>
  first.length === second.length && first.every((item, index) => item === second[index]);

const metaOf = (artwork: Artwork): ArtworkMeta => ({
  name: artwork.name,
  defaultBankId: artwork.defaultBankId,
  coverSpriteId: artwork.coverSpriteId,
  platformId: artwork.platformId,
});

const metaOps = (base: Artwork, next: Artwork): UndoOp[] => {
  const before = metaOf(base);
  const after = metaOf(next);
  const same =
    before.name === after.name &&
    before.defaultBankId === after.defaultBankId &&
    before.coverSpriteId === after.coverSpriteId &&
    before.platformId === after.platformId;
  return same ? [] : [{ kind: 'entity', path: META_PATH, before, after }];
};

const collectionOps = (base: Artwork, next: Artwork): UndoOp[] => [
  ...metaOps(base, next),
  ...COLLECTION_KEYS.flatMap((key): UndoOp[] =>
    sameList(base[key], next[key])
      ? []
      : [{ kind: 'entity', path: `${COLLECTION_PREFIX}${key}`, before: base[key], after: next[key] }],
  ),
];

export { collectionOps };
