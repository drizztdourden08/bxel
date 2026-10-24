/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { fileName } from '../files/file-name';
import { IMPORT_TEXT, PNG_FILTERS } from './image-import.constants';
import type { ImageRead } from './image-import.type';
import { readImage } from './read-image';

const pickImage = async (documents: DocumentsPort): Promise<ImageRead | null> => {
  const path = await documents.open({ title: IMPORT_TEXT.pickTitle, filters: PNG_FILTERS });
  if (path === null) return null;
  try {
    return readImage(await documents.read(path), fileName(path));
  } catch {
    return { ok: false, message: IMPORT_TEXT.unreadable };
  }
};

export { pickImage };
