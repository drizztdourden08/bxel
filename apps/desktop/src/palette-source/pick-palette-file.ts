/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { fileName } from '../files/file-name';
import { PALETTE_FILE_FILTERS, SOURCE_TEXT } from './palette-source.constants';
import type { PaletteRead } from './palette-source.type';
import { readPaletteFile } from './read-palette-file';

const pickPaletteFile = async (documents: DocumentsPort): Promise<PaletteRead | null> => {
  const path = await documents.open({ title: SOURCE_TEXT.title, filters: PALETTE_FILE_FILTERS });
  if (path === null) return null;
  try {
    return readPaletteFile(await documents.read(path), fileName(path));
  } catch {
    return { ok: false, message: SOURCE_TEXT.unreadable };
  }
};

export { pickPaletteFile };
