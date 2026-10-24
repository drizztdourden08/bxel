/* @layer renderer-app @kind test */
import { decodeProject } from '@bxel/project';
import { addLinkedFolder } from '../../src/project/add-linked-folder';
import { openProject } from '../../src/project/open-project';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { ROOT, withManifest } from './project-harness';
import type { Rig } from './project-harness';

const SHARED = 'C:/Art/Shared';

const openedProject = async (held: Rig): Promise<void> => {
  withManifest(held.disk);
  held.disk.picks.folder = ROOT;
  await openProject();
};

const storedManifest = (held: Rig) => {
  const bytes = held.disk.files.get(`${ROOT}/Dungeon.bxproject`);
  const decoded = decodeProject(bytes instanceof Uint8Array ? bytes : new Uint8Array());
  if (!decoded.ok) throw new Error(decoded.message);
  return decoded.value.manifest;
};

const currentProject = () => {
  const open = useProjectStore.getState().project;
  if (!open) throw new Error('no project is open');
  return open;
};

const linkFolderAt = (held: Rig, path: string) => {
  held.disk.dirs.add(path);
  held.disk.picks.folder = path;
  return addLinkedFolder();
};

export { currentProject, linkFolderAt, openedProject, SHARED, storedManifest };
