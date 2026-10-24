/* @layer core @kind logic */
import { ASSETS_DIR } from '../container/project-container.constants';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import type { ProjectDocument } from '../project-document/project-document.type';
import type { FolderLocation } from '../manifest/manifest.type';
import { folderDirs } from './folder-dirs';
import { judgeFile } from './judge-file';
import { MAX_PACKED_ASSETS } from './pack.constants';
import type { PackOperation, PackPlan, SkippedFile } from './pack.type';
import { packedManifest } from './packed-manifest';

const packProject = (manifest: ProjectDocument, files: readonly FolderLocation[]): ProjectResult<PackPlan> => {
  const dirs = folderDirs(manifest.folders);
  const order = new Map(manifest.folders.map((folder, index) => [folder.folderId, index]));
  const sorted = [...files].sort(
    (left, right) =>
      (order.get(left.folderId) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.folderId) ?? Number.MAX_SAFE_INTEGER) ||
      (left.path < right.path ? -1 : 1),
  );
  const seen = new Set<string>();
  const operations: PackOperation[] = [];
  const skipped: SkippedFile[] = [];
  for (const file of sorted) {
    const key = `${file.folderId}/${file.path.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const verdict = judgeFile(
      manifest.folders.find((folder) => folder.folderId === file.folderId),
      file.path,
    );
    if (verdict.kind === 'skip') skipped.push({ path: file.path, reason: verdict.reason });
    if (verdict.kind === 'add') operations.push({ kind: 'add', from: file, entry: `${ASSETS_DIR}${dirs.get(file.folderId) ?? ''}/${file.path}` });
  }
  if (operations.length > MAX_PACKED_ASSETS) {
    return projectFail(PROJECT_ERROR_CODE.TOO_MANY_ASSETS, `A packed project holds up to ${MAX_PACKED_ASSETS} assets.`);
  }
  return projectOk({ manifest: packedManifest(manifest, dirs), operations, skipped });
};

export { packProject };
