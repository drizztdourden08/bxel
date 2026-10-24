/* @layer renderer-app @kind logic */
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import type { AssetRow } from './asset-list.type';
import { DRIVE_PATH, WINDOWS_SEPARATOR } from './asset-list.constants';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';

const revealRow = (row: AssetRow): void => {
  const { revealPath } = getPlatform().filePicker;
  if (row.path === '' || !revealPath) {
    toast(ASSET_LIST_TEXT.revealFailed, { variant: 'info' });
    return;
  }
  void revealPath(DRIVE_PATH.test(row.path) ? row.path.replaceAll('/', WINDOWS_SEPARATOR) : row.path).then((result) => {
    if (!result.success) toast(ASSET_LIST_TEXT.revealFailed, { variant: 'warning' });
  });
};

export { revealRow };
