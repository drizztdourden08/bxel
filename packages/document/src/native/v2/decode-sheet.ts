/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { AssetReport } from './asset-report.type';
import { fatalAssetReport } from './fatal-asset-report';
import { finishAssetReport } from './finish-asset-report';
import { readAsset } from './read-asset';
import { sheetPlaceholders } from './sheet-placeholders';
import { suppliesAnimation } from './supplies-animation';
import { suppliesSprite } from './supplies-sprite';
import { validateSheetFile } from './validate-sheet-file';

const decodeSheet = (bytes: Uint8Array, sprites: readonly AssetSlice[] = []): AssetReport => {
  const read = readAsset(bytes, ASSET_KIND.sheet);
  if (!read.ok) return fatalAssetReport(read.issues);
  const { opened, check, json } = read.value;
  const file = validateSheetFile(json, opened.manifest);
  if (!file.ok) return fatalAssetReport(file.issues);
  const { sheet, presets } = file.value;
  const missing = opened.manifest.links.filter((link) => !suppliesSprite(sprites, link.id) && !suppliesAnimation(sprites, link.id));
  const slice = {
    kind: ASSET_KIND.sheet,
    id: sheet.id,
    name: sheet.name,
    artwork: { sheets: [sheet], presets, ...sheetPlaceholders(sheet, missing) },
    links: opened.manifest.links,
  };
  return finishAssetReport({ opened, check, slice, damage: [], missing });
};

export { decodeSheet };
