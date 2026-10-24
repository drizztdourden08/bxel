/* @layer renderer-app @kind logic */
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';

const revealRow = (row: { readonly path: string }): void => {
  const documents = getPlatform().documents;
  if (row.path === '' || !documents) {
    toast(ASSET_LIST_TEXT.revealFailed, { variant: 'info' });
    return;
  }
  void documents.reveal(row.path).then((result) => {
    if (!result.revealed) toast(ASSET_LIST_TEXT.revealFailed, { variant: 'warning' });
  });
};

export { revealRow };
