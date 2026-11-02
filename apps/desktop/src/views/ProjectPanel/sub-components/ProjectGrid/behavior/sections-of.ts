/* @layer renderer-app @kind logic */
import type { BrowserItem, VisibleRow } from '../../../../../panel-browser/project-browser.type';
import { dropFolder } from '../../../behavior/drop-folder';
import { FILES_TYPE } from '../ProjectGrid.constants';
import type { FilesDrop, GridSection } from '../ProjectGrid.type';

const dropHandlers = (item: BrowserItem, onFiles: FilesDrop | undefined): Pick<GridSection, 'onDropData' | 'accepts'> => {
  if (onFiles === undefined || dropFolder(item) === undefined) return {};
  return {
    accepts: (data) => data.types.includes(FILES_TYPE),
    onDropData: (data) => onFiles(item, [...data.files]),
  };
};

const sectionsOf = (rows: readonly VisibleRow[], onFiles?: FilesDrop): readonly GridSection[] => {
  const sections: GridSection[] = [];
  for (const row of rows) {
    if (row.expanded !== null) sections.push({ key: row.item.key, label: row.item.name, items: [], count: row.count ?? 0, ...dropHandlers(row.item, onFiles) });
    else if (sections.length === 0) sections.push({ key: 'all', label: '', items: [row.item], count: 0 });
    else sections[sections.length - 1]?.items.push(row.item);
  }
  return sections;
};

export { sectionsOf };
