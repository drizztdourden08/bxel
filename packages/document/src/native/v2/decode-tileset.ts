/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { AssetReport } from './asset-report.type';
import { buildTilesetSlice } from './build-tileset-slice';
import { fatalAssetReport } from './fatal-asset-report';
import { finishAssetReport } from './finish-asset-report';
import { readTilesetFile } from './read-tileset-file';

const decodeTileset = (bytes: Uint8Array, palette: AssetSlice | null = null): AssetReport => {
  const read = readTilesetFile(bytes);
  if (!read.ok) return fatalAssetReport(read.issues);
  const built = buildTilesetSlice(read.value, palette);
  return finishAssetReport({ opened: read.value.opened, check: read.value.check, ...built });
};

export { decodeTileset };
