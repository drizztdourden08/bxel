/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { PROJECT_SUBFOLDERS } from './project.constants';

const makeSubfolders = async (documents: DocumentsPort, folder: string): Promise<void> => {
  for (const name of Object.values(PROJECT_SUBFOLDERS)) {
    const path = joinInside(folder, name);
    if (!path.ok) throw new Error(path.message);
    await documents.mkdir(path.value, { recursive: true });
  }
};

export { makeSubfolders };
