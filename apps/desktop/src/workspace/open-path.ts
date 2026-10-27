/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import { fileName } from '../files/file-name';
import type { FileKit, FileOutcome } from '../files/files.type';
import { openProjectFile } from '../project/open-project-file';
import { openArtworkPath } from './open-artwork-path';

const openPath = async (kit: FileKit, path: string): Promise<FileOutcome> =>
  entryKindOf(fileName(path)) === 'project' ? openProjectFile(kit, path) : openArtworkPath(kit, path);

export { openPath };
