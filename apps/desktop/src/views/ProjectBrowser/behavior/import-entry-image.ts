/* @layer renderer-app @kind logic */
import { getPlatform, nav, toast } from '@drizztdourden08/brock-react';
import { fileName } from '../../../files/file-name';
import { readImage } from '../../../image-import/read-image';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useImportStore } from '../../../stores/useImportStore';

const importEntryImage = async (entry: BrowserEntry): Promise<void> => {
  const documents = getPlatform().documents;
  if (!documents || entry.kind !== 'file' || entry.row.kind !== 'image') return;
  const read = readImage(await documents.read(entry.row.path), fileName(entry.row.path));
  if (!read.ok) {
    toast(read.message, { variant: 'warning' });
    return;
  }
  nav.close();
  useImportStore.getState().show(read.image);
};

export { importEntryImage };
