/* @layer renderer-app @kind logic */
import { openRow } from '../asset-list/open-row';
import { runFileAction } from '../files/run-file-action';
import type { BrowserItem } from './project-browser.type';

const openItem = (item: BrowserItem): void => {
  if (item.row !== null) openRow(item.row);
  else if (item.kind === 'project' || item.kind === 'legacy') void runFileAction({ kind: 'openPath', path: item.path });
};

export { openItem };
