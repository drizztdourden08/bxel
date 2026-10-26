/* @layer renderer-app @kind logic */
import { toast, writeClipboard } from '@drizztdourden08/brock-react';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';

const copyPath = async (path: string): Promise<void> => {
  if (path === '') {
    toast(ASSET_LIST_TEXT.noPath, { variant: 'info' });
    return;
  }
  const copied = await writeClipboard(path);
  toast(copied ? ASSET_LIST_TEXT.pathCopied : ASSET_LIST_TEXT.pathFailed, { variant: copied ? 'success' : 'danger' });
};

export { copyPath };
