/* @layer renderer-app @kind logic */
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import { FILE_TEXT } from '../files/files.constants';
import { useImportStore } from '../stores/useImportStore';
import { pickImage } from './pick-image';

const startImport = async (): Promise<void> => {
  const documents = getPlatform().documents;
  if (!documents) {
    toast(FILE_TEXT.unavailable, { variant: 'info' });
    return;
  }
  const picked = await pickImage(documents);
  if (picked === null) return;
  if (picked.ok) useImportStore.getState().show(picked.image);
  else toast(picked.message, { variant: 'warning' });
};

export { startImport };
