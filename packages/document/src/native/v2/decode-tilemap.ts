/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import { restoreTilemap } from '../restore-tilemap';
import type { AssetReport } from './asset-report.type';
import { fatalAssetReport } from './fatal-asset-report';
import { finishAssetReport } from './finish-asset-report';
import { readAsset } from './read-asset';
import { suppliedTileset } from './supplied-tileset';
import { tilemapPlaceholders } from './tilemap-placeholders';
import { validateTilemapFile } from './validate-tilemap-file';

const decodeTilemap = (bytes: Uint8Array, tileset: AssetSlice | null = null): AssetReport => {
  const read = readAsset(bytes, ASSET_KIND.tilemap);
  if (!read.ok) return fatalAssetReport(read.issues);
  const { opened, check, json } = read.value;
  const file = validateTilemapFile(json, opened.manifest);
  if (!file.ok) return fatalAssetReport(file.issues);
  const supplied = suppliedTileset(tileset, file.value.tilemap.tilesetId);
  const { tilemap, damage } = restoreTilemap(file.value.tilemap, supplied, check);
  const missing = supplied ? [] : opened.manifest.links.filter((link) => link.id === tilemap.tilesetId);
  const slice = {
    kind: ASSET_KIND.tilemap,
    id: tilemap.id,
    name: tilemap.name,
    artwork: { tilemaps: [tilemap], ...(missing[0] ? tilemapPlaceholders(missing[0]) : {}) },
    links: opened.manifest.links,
  };
  return finishAssetReport({ opened, check, slice, damage: [], mapDamage: damage, forceReadOnly: !supplied, missing });
};

export { decodeTilemap };
