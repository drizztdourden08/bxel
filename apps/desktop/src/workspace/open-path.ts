/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import { failed } from '../files/failed';
import { fileName } from '../files/file-name';
import type { FileKit, FileOutcome } from '../files/files.type';
import { openProjectFile } from '../project/open-project-file';
import { openAssetPath } from './open-asset-path';
import { openLegacyFile } from './open-legacy-file';
import { ASSET_KINDS, WORKSPACE_TEXT } from './workspace.constants';

const openPath = async (kit: FileKit, path: string): Promise<FileOutcome> => {
  const kind = entryKindOf(fileName(path));
  if (kind === 'legacy') return openLegacyFile(kit, path);
  if (kind === 'project') return openProjectFile(kit, path);
  return ASSET_KINDS.includes(kind) ? openAssetPath(kit, path) : failed(WORKSPACE_TEXT.notNative);
};

export { openPath };
