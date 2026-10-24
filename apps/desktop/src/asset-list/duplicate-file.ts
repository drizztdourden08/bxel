/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { baseName } from '../files/base-name';
import { fileExtension } from '../files/file-extension';
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { parentOf } from '../workspace/parent-of';
import { uniquePath } from '../workspace/unique-path';
import type { AssetRow } from './asset-list.type';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';
import { copyName } from './copy-name';

const duplicateFile = async (row: AssetRow): Promise<void> => {
  const kit = fileKit();
  if (!kit) return;
  const dir = parentOf(row.path);
  try {
    const listing = await kit.documents.list(dir);
    const taken = new Set(listing.entries.map((entry) => entry.path.replaceAll('\\', '/').toLowerCase()));
    const stem = copyName([], baseName(row.path));
    const path = uniquePath(dir, stem, `.${fileExtension(row.path)}`, taken);
    await kit.documents.write(path, await kit.documents.read(row.path), { recent: false });
    toast(ASSET_LIST_TEXT.duplicated(baseName(path)), { variant: 'success' });
  } catch (error) {
    toast(ASSET_LIST_TEXT.duplicateFailed(reasonOf(error)), { variant: 'danger' });
  }
};

export { duplicateFile };
