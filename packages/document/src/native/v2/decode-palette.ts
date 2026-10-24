/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetReport } from './asset-report.type';
import { fatalAssetReport } from './fatal-asset-report';
import { finishAssetReport } from './finish-asset-report';
import { readAsset } from './read-asset';
import { validatePaletteFile } from './validate-palette-file';

const decodePalette = (bytes: Uint8Array): AssetReport => {
  const read = readAsset(bytes, ASSET_KIND.palette);
  if (!read.ok) return fatalAssetReport(read.issues);
  const { opened, check, json } = read.value;
  const bank = validatePaletteFile(json, opened.manifest);
  if (!bank.ok) return fatalAssetReport(bank.issues);
  const slice = {
    kind: ASSET_KIND.palette,
    id: bank.value.id,
    name: bank.value.name,
    artwork: { banks: [bank.value] },
    links: opened.manifest.links,
  };
  return finishAssetReport({ opened, check, slice, damage: [], missing: [] });
};

export { decodePalette };
