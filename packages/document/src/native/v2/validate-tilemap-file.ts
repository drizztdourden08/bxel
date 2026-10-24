/* @layer core @kind logic */
import { tilemapFileSchema } from '../../schema/tilemap-file-schema';
import type { Parsed } from '../parsed.type';
import type { AssetManifest } from './asset-manifest.type';
import { checkAssetFile } from './check-asset-file';
import { externalFromLinks } from './external-from-links';
import { parseAssetFile } from './parse-asset-file';
import { scopedDocument } from './scoped-document';
import type { TilemapFileJson } from './tilemap-file.type';

const validateTilemapFile = (json: unknown, manifest: AssetManifest): Parsed<TilemapFileJson> => {
  const parsed = parseAssetFile(json, tilemapFileSchema);
  if (!parsed.ok) return parsed;
  const file: TilemapFileJson = parsed.value;
  const document = scopedDocument({ tilemaps: [file.tilemap] });
  const external = externalFromLinks(manifest.links, 'tilesets');
  const issues = checkAssetFile(manifest.assetId, file.tilemap.id, document, external);
  return issues.length > 0 ? { ok: false, issues } : { ok: true, value: file };
};

export { validateTilemapFile };
