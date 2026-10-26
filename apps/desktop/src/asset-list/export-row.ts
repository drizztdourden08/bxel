/* @layer renderer-app @kind logic */
import { openAnimationExport } from '../export/open-animation-export';
import { openExport } from '../export/open-export';
import { focusTab } from '../workspace/focus-tab';
import type { AssetRow } from './asset-list.type';
import { EXPORT_KIND_OF } from './export-row.constants';
import { rowTab } from './row-tab';

const exportRow = (row: AssetRow): void => {
  const tab = rowTab(row);
  const kind = EXPORT_KIND_OF[row.kind];
  if (!tab || kind === undefined) return;
  focusTab(tab);
  if (kind === 'animation') openAnimationExport(tab.key.id);
  else openExport(kind);
};

export { exportRow };
