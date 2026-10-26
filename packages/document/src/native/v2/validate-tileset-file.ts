/* @layer core @kind logic */
import { tilesetFileSchema } from '../../schema/tileset-file-schema';
import type { Parsed } from '../parsed.type';
import type { AssetManifest } from './asset-manifest.type';
import { checkAssetFile } from './check-asset-file';
import { parseAssetFile } from './parse-asset-file';
import { scopedDocument } from './scoped-document';
import { tilesetAnimationIssues } from './tileset-animation-issues';
import type { TilesetFileJson } from './tileset-file.type';
import { unusedTileSprites } from './unused-tile-sprites';

const validateTilesetFile = (json: unknown, manifest: AssetManifest): Parsed<TilesetFileJson> => {
  const parsed = parseAssetFile(json, tilesetFileSchema);
  if (!parsed.ok) return parsed;
  const file: TilesetFileJson = parsed.value;
  const document = scopedDocument({ banks: [file.palette], sprites: file.sprites, tilesets: [file.tileset] });
  const issues = [...checkAssetFile(manifest.assetId, file.tileset.id, document), ...unusedTileSprites(file), ...tilesetAnimationIssues(file, manifest)];
  return issues.length > 0 ? { ok: false, issues } : { ok: true, value: file };
};

export { validateTilesetFile };
