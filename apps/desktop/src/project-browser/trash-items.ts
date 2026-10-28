/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { removeLoadedRows } from '../asset-list/remove-loaded-rows';
import { PROJECT_TEXT } from '../project/project.constants';
import { trashEntries } from '../project/trash-entries';
import type { BrowserItem } from './project-browser.type';

const onDisk = (item: BrowserItem): boolean => item.path !== '' && item.role !== 'ghost' && !(item.row?.loaded ?? false);

const trashItems = async (items: readonly BrowserItem[]): Promise<void> => {
  const loaded = items.flatMap((item) => (item.row?.loaded === true ? [item.row] : []));
  const files = items.filter(onDisk);
  if (loaded.length > 0) removeLoadedRows(loaded);
  if (files.length === 0) return;
  const outcome = await trashEntries(files.map((item) => item.path), files[0]?.fileName ?? '');
  if (outcome !== null && !outcome.ok) toast(PROJECT_TEXT.failed(outcome.message), { variant: 'danger' });
};

export { trashItems };
