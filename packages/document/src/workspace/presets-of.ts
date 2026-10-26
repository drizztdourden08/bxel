/* @layer core @kind logic */
import { ASSET_KIND } from '../model/asset-format.constants';
import type { Artwork } from '../model/artwork.type';
import type { ExportPreset } from '../model/export-preset.type';
import type { AssetKey } from './asset-key.type';
import { homedPresets } from './homed-presets';
import { projectPresets } from './project-presets';
import { spriteOwners } from './sprite-owners';

const presetsOf = (artwork: Artwork, key: AssetKey): readonly ExportPreset[] =>
  key.kind === ASSET_KIND.project ? projectPresets(artwork) : homedPresets({ artwork, owners: spriteOwners(artwork) }, key);

export { presetsOf };
