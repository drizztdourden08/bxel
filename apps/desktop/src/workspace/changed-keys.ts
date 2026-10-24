/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey, ChangeSet, EntityChange } from '@bxel/document';
import { assetName } from './asset-name';

const keysOf = (kind: AssetKey['kind'], changes: readonly EntityChange<string>[], wanted: (change: EntityChange<string>) => boolean) =>
  changes.filter(wanted).map((change) => ({ kind, id: change.id }));

const changedKeys = (changes: ChangeSet, artwork: Artwork, wanted: (change: EntityChange<string>) => boolean): readonly AssetKey[] =>
  [
    ...keysOf('sprite', changes.sprites, wanted),
    ...keysOf('sheet', changes.sheets, wanted),
    ...keysOf('tilemap', changes.tilemaps, wanted),
    ...keysOf('tileset', changes.tilesets, wanted),
  ].filter((key) => assetName(artwork, key) !== null);

export { changedKeys };
