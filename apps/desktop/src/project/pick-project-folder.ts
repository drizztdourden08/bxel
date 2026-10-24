/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { PROJECT_TEXT } from './project.constants';
import { regrantFolder } from './regrant-folder';

const pickProjectFolder = async (documents: DocumentsPort, startAt?: string): Promise<string | null> => {
  if (startAt === undefined) return documents.openFolder({ title: PROJECT_TEXT.pickTitle });
  return (await regrantFolder(documents, startAt)) ?? documents.openFolder({ title: PROJECT_TEXT.pickTitle, defaultPath: startAt });
};

export { pickProjectFolder };
