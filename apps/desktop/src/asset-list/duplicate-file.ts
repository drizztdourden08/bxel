/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { baseName } from '../files/base-name';
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import type { AssetRow } from './asset-list.type';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';
import { copyFileBeside } from './copy-file-beside';

const duplicateFile = async (row: AssetRow): Promise<void> => {
  const kit = fileKit();
  if (!kit) return;
  try {
    toast(ASSET_LIST_TEXT.duplicated(baseName(await copyFileBeside(kit.documents, row.path))), { variant: 'success' });
  } catch (error) {
    toast(ASSET_LIST_TEXT.duplicateFailed(reasonOf(error)), { variant: 'danger' });
  }
};

export { duplicateFile };
