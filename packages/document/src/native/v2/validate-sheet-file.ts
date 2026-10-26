/* @layer core @kind logic */
import { sheetFileSchema } from '../../schema/sheet-file-schema';
import type { Parsed } from '../parsed.type';
import type { AssetManifest } from './asset-manifest.type';
import { checkAssetFile } from './check-asset-file';
import { externalFromLinks } from './external-from-links';
import { parseAssetFile } from './parse-asset-file';
import { sheetAnimationIssues } from './sheet-animation-issues';
import { scopedDocument } from './scoped-document';
import type { SheetFileJson } from './sheet-file.type';

const validateSheetFile = (json: unknown, manifest: AssetManifest): Parsed<SheetFileJson> => {
  const parsed = parseAssetFile(json, sheetFileSchema);
  if (!parsed.ok) return parsed;
  const file: SheetFileJson = parsed.value;
  const document = scopedDocument({ sheets: [file.sheet], presets: file.presets });
  const external = externalFromLinks(manifest.links, 'sprites');
  const issues = [...checkAssetFile(manifest.assetId, file.sheet.id, document, external), ...sheetAnimationIssues(file, manifest)];
  return issues.length > 0 ? { ok: false, issues } : { ok: true, value: file };
};

export { validateSheetFile };
