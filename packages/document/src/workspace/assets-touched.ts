/* @layer core @kind logic */
import type { ChangeSet } from '../commands/result.type';
import { ASSET_KIND } from '../model/asset-format.constants';
import type { Artwork } from '../model/artwork.type';
import type { AssetKind } from '../model/asset.type';
import type { AssetKey } from './asset-key.type';
import { dedupeKeys } from './dedupe-keys';
import { tileOwners } from './tile-owners';
import { touchedPresetKeys } from './touched-preset-keys';

const keysOf = (kind: AssetKind, changes: readonly { readonly id: string }[]): readonly AssetKey[] =>
  changes.map((change) => ({ kind, id: change.id }));

const spriteKeys = (changes: ChangeSet, owners: ReadonlyMap<string, string>): readonly AssetKey[] =>
  changes.sprites.map((change) => {
    const tileset = owners.get(change.id);
    return tileset === undefined ? { kind: ASSET_KIND.sprite, id: change.id } : { kind: ASSET_KIND.tileset, id: tileset };
  });

const assetsTouched = (changes: ChangeSet, before: Artwork, after: Artwork): readonly AssetKey[] => {
  const owners = new Map([...tileOwners(before), ...tileOwners(after)]);
  return dedupeKeys([
    ...(changes.artwork ? [{ kind: ASSET_KIND.project, id: after.id }] : []),
    ...keysOf(ASSET_KIND.palette, changes.banks),
    ...spriteKeys(changes, owners),
    ...keysOf(ASSET_KIND.sheet, changes.sheets),
    ...touchedPresetKeys(changes.presets, [before, after], owners),
    ...keysOf(ASSET_KIND.tileset, changes.tilesets),
    ...keysOf(ASSET_KIND.tilemap, changes.tilemaps),
  ]);
};

export { assetsTouched };
