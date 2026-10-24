/* @layer core @kind logic */
import type { PaletteBank } from '../../model/palette.type';
import { paletteFileSchema } from '../../schema/palette-file-schema';
import type { Parsed } from '../parsed.type';
import type { AssetManifest } from './asset-manifest.type';
import { checkAssetFile } from './check-asset-file';
import { parseAssetFile } from './parse-asset-file';
import { scopedDocument } from './scoped-document';

const validatePaletteFile = (json: unknown, manifest: AssetManifest): Parsed<PaletteBank> => {
  const parsed = parseAssetFile(json, paletteFileSchema);
  if (!parsed.ok) return parsed;
  const { bank } = parsed.value;
  const issues = checkAssetFile(manifest.assetId, bank.id, scopedDocument({ banks: [bank], sprites: [], presets: [] }));
  return issues.length > 0 ? { ok: false, issues } : { ok: true, value: bank };
};

export { validatePaletteFile };
