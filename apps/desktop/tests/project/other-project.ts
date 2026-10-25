/* @layer renderer-app @kind test */
import { createFolderId, createProjectDocument, createProjectId } from '@bxel/project';
import type { OpenProject } from '../../src/project/project.type';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { key } from './disk-paths';
import type { Disk } from './memory-disk';

const OTHER = 'C:/Art/Other';

const otherBytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, index) => index + 40);

const holdOtherProject = (disk: Disk): OpenProject => {
  const manifest = createProjectDocument({ projectId: createProjectId(otherBytes), folderId: createFolderId(otherBytes), name: 'Other' });
  const folder = manifest.folders[0];
  if (!folder) throw new Error('no root folder');
  disk.dirs.add(OTHER);
  disk.granted.add(key(OTHER));
  const other: OpenProject = {
    manifest,
    rootRealPath: OTHER,
    projectFile: `${OTHER}/Other.bxproject`,
    preview: null,
    folders: [{ folderId: folder.folderId, name: folder.name, path: OTHER, granted: true }],
  };
  useProjectStore.getState().setHeld([other]);
  return other;
};

export { holdOtherProject, OTHER };
