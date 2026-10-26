/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { openProject } from '../project/open-project';
import { regrantFolder } from '../project/regrant-folder';

const openKnownProject = async (root: string): Promise<void> => {
  const kit = fileKit();
  if (kit) await regrantFolder(kit.documents, root);
  await openProject(root, true);
};

export { openKnownProject };
