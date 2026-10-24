/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import { failed } from '../files/failed';
import { fileName } from '../files/file-name';
import type { FileKit, FileOutcome } from '../files/files.type';
import { openProject } from '../project/open-project';
import { openAssetPath } from './open-asset-path';
import { openLegacyFile } from './open-legacy-file';
import { parentOf } from './parent-of';
import { ASSET_KINDS, WORKSPACE_TEXT } from './workspace.constants';

const openPath = async (kit: FileKit, path: string): Promise<FileOutcome> => {
  const kind = entryKindOf(fileName(path));
  if (kind === 'legacy') return openLegacyFile(kit, path);
  if (kind === 'project') {
    await openProject(parentOf(path), true);
    return { kind: 'done', path, notice: null };
  }
  return ASSET_KINDS.includes(kind) ? openAssetPath(kit, path) : failed(WORKSPACE_TEXT.notNative);
};

export { openPath };
