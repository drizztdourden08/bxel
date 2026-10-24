/* @layer core @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import type { FolderId } from '../ids/id.type';
import type { ProjectDocument } from '../project-document/project-document.type';
import { normalizeAbsolute } from '../paths/normalize-absolute';
import { folderDirs } from './folder-dirs';
import { folderTargets } from './folder-targets';
import type { UnpackPlan } from './pack.type';
import { planExtracts } from './plan-extracts';
import { unpackDirectories } from './unpack-directories';
import { unpackedManifest } from './unpacked-manifest';

const unpackProject = (
  manifest: ProjectDocument,
  entries: readonly string[],
  destination: string,
): ProjectResult<UnpackPlan> => {
  const base = normalizeAbsolute(destination);
  if (base === undefined) return projectFail(PROJECT_ERROR_CODE.FOLDER_INVALID, 'The destination is not an absolute path.');
  const dirs = folderDirs(manifest.folders);
  const targets = folderTargets(manifest.folders, dirs, base);
  const root = targets.get(manifest.folders[0]?.folderId as FolderId) ?? '';
  const unpacked = unpackedManifest(manifest, targets, root);
  if (!unpacked.ok) return unpacked;
  const folderOfDir = new Map<string, FolderId>([...dirs].map(([folderId, dir]) => [dir, folderId]));
  const { extracts, skipped } = planExtracts(entries, folderOfDir, targets);
  return projectOk({
    manifest: unpacked.value,
    root,
    projectFile: `${root}/${manifest.name}${ASSET_FORMAT.project.extension}`,
    operations: [...unpackDirectories(targets, extracts), ...extracts],
    skipped,
  });
};

export { unpackProject };
