/* @layer core @kind logic */
import { ASSET_KIND } from '../model/asset-format.constants';
import type { Artwork } from '../model/artwork.type';
import type { AssetKind } from '../model/asset.type';
import { tileOwners } from './tile-owners';
import type { SplitEntry } from './split-plan.type';

const entriesOf = (kind: AssetKind, items: readonly { readonly id: string; readonly name: string }[]): readonly SplitEntry[] =>
  items.map((item) => ({ key: { kind, id: item.id }, name: item.name }));

const legacyEntries = (artwork: Artwork): readonly SplitEntry[] => {
  const owners = tileOwners(artwork);
  return [
    ...entriesOf(ASSET_KIND.palette, artwork.banks),
    ...entriesOf(ASSET_KIND.sprite, artwork.sprites.filter((sprite) => !owners.has(sprite.id))),
    ...entriesOf(ASSET_KIND.sheet, artwork.sheets),
    ...entriesOf(ASSET_KIND.tileset, artwork.tilesets),
    ...entriesOf(ASSET_KIND.tilemap, artwork.tilemaps),
  ];
};

export { legacyEntries };
