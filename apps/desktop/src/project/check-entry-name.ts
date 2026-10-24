/* @layer renderer-app @kind logic */
import { checkRelPath } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { FOLDER_PART_PATTERN, PROJECT_TEXT } from './project.constants';

const taken = async (documents: DocumentsPort, dir: string, name: string, own: string | undefined): Promise<boolean> => {
  const listing = await documents.list(dir);
  return listing.entries.some((entry) => entry.name !== own && entry.name.toLowerCase() === name.toLowerCase());
};

const checkEntryName = async (documents: DocumentsPort, dir: string, name: string, own?: string): Promise<string | null> => {
  if (FOLDER_PART_PATTERN.test(name)) return PROJECT_TEXT.nameNoFolder;
  const checked = checkRelPath(name);
  if (!checked.ok) return checked.message;
  return (await taken(documents, dir, name, own)) ? PROJECT_TEXT.nameExists(name) : null;
};

export { checkEntryName };
