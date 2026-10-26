/* @layer core @kind logic */
import type { ChangeSet } from '../commands/result.type';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import { isId } from '../ids/is-id';
import { ASSET_KIND } from '../model/asset-format.constants';
import type { Artwork } from '../model/artwork.type';
import type { AssetKind } from '../model/asset.type';
import type { AssetKey } from './asset-key.type';
import { dedupeKeys } from './dedupe-keys';
import { spriteOwners } from './sprite-owners';
import { touchedPresetKeys } from './touched-preset-keys';

const keysOf = (kind: AssetKind, changes: readonly { readonly id: string }[]): readonly AssetKey[] =>
  changes.map((change) => ({ kind, id: change.id }));

const spriteKeys = (changes: ChangeSet, owners: ReadonlyMap<string, string>): readonly AssetKey[] =>
  changes.sprites.map((change) => {
    const owner = owners.get(change.id);
    return owner !== undefined && isId(owner, ID_PREFIX.tileset)
      ? { kind: ASSET_KIND.tileset, id: owner }
      : { kind: ASSET_KIND.sprite, id: change.id };
  });

const assetsTouched = (changes: ChangeSet, before: Artwork, after: Artwork): readonly AssetKey[] => {
  const owners = new Map([...spriteOwners(before), ...spriteOwners(after)]);
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
