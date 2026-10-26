/* @layer core @kind logic */
import { animationFileSchema } from '../../schema/animation-file-schema';
import type { Parsed } from '../parsed.type';
import { animationFileIssues } from './animation-file-issues';
import type { AnimationFileJson } from './animation-file.type';
import type { AssetManifest } from './asset-manifest.type';
import { checkAssetFile } from './check-asset-file';
import { externalFromLinks } from './external-from-links';
import { parseAssetFile } from './parse-asset-file';
import { scopedDocument } from './scoped-document';

const validateAnimationFile = (json: unknown, manifest: AssetManifest): Parsed<AnimationFileJson> => {
  const parsed = parseAssetFile(json, animationFileSchema);
  if (!parsed.ok) return parsed;
  const file: AnimationFileJson = parsed.value;
  const document = scopedDocument({ banks: [file.palette], sprites: file.sprites, presets: file.presets });
  const external = externalFromLinks(manifest.links, 'sprites');
  const issues = [
    ...checkAssetFile(manifest.assetId, file.animation.id, document, external),
    ...animationFileIssues(file, external.sprites),
  ];
  return issues.length > 0 ? { ok: false, issues } : { ok: true, value: file };
};

export { validateAnimationFile };
