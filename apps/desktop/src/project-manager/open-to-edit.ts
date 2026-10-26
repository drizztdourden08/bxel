/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AssetRow } from '../asset-list/asset-list.type';
import { openRow } from '../asset-list/open-row';

const openToEdit = (row: AssetRow): void => {
  openRow(row);
  nav.close();
};

export { openToEdit };
