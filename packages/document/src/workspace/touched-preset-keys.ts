/* @layer core @kind logic */
import type { EntityChange } from '../commands/result.type';
import { ASSET_KIND } from '../model/asset-format.constants';
import type { Artwork } from '../model/artwork.type';
import type { PresetId } from '../model/ids.type';
import type { AssetKey } from './asset-key.type';
import { presetHome } from './preset-home';

const homesIn = (artwork: Artwork, id: string, owners: ReadonlyMap<string, string>): readonly AssetKey[] => {
  const preset = artwork.presets.find((item) => item.id === id);
  if (!preset) return [];
  return [presetHome(artwork, preset, owners) ?? { kind: ASSET_KIND.project, id: artwork.id }];
};

const touchedPresetKeys = (
  changes: readonly EntityChange<PresetId>[],
  artworks: readonly [Artwork, Artwork],
  owners: ReadonlyMap<string, string>,
): readonly AssetKey[] =>
  changes.flatMap((change) => artworks.flatMap((artwork) => homesIn(artwork, change.id, owners)));

export { touchedPresetKeys };
