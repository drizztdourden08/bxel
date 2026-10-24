/* @layer core @kind logic */
import { spriteFileSchema } from '../../schema/sprite-file-schema';
import type { Parsed } from '../parsed.type';
import type { AssetManifest } from './asset-manifest.type';
import { checkAssetFile } from './check-asset-file';
import { parseAssetFile } from './parse-asset-file';
import { scopedDocument } from './scoped-document';
import type { SpriteFileJson } from './sprite-file.type';

const validateSpriteFile = (json: unknown, manifest: AssetManifest): Parsed<SpriteFileJson> => {
  const parsed = parseAssetFile(json, spriteFileSchema);
  if (!parsed.ok) return parsed;
  const file: SpriteFileJson = parsed.value;
  const document = scopedDocument({ banks: [file.palette], sprites: [file.sprite], presets: file.presets });
  const issues = checkAssetFile(manifest.assetId, file.sprite.id, document);
  return issues.length > 0 ? { ok: false, issues } : { ok: true, value: file };
};

export { validateSpriteFile };
