/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { moveEntry } from '../project/move-entry';
import { PROJECT_TEXT } from '../project/project.constants';
import type { BrowserItem } from './project-browser.type';

const moveItems = async (items: readonly BrowserItem[], folder: BrowserItem): Promise<void> => {
  const movable = items.filter((item) => item.path !== '' && item.role !== 'ghost' && item.key !== folder.key);
  let moved = 0;
  for (const item of movable) {
    const outcome = await moveEntry(item.path, folder.path);
    if (outcome.ok) moved += 1;
    else toast(PROJECT_TEXT.failed(outcome.message), { variant: 'danger' });
  }
  if (moved > 0) toast(PROJECT_TEXT.moved(moved, folder.name), { variant: 'success' });
};

export { moveItems };
