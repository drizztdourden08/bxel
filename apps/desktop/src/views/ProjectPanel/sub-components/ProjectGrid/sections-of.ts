/* @layer renderer-app @kind logic */
import type { VirtualGridSection } from '@drizztdourden08/tessera';
import type { BrowserItem, VisibleRow } from '../../../../panel-browser/project-browser.type';

const sectionsOf = (rows: readonly VisibleRow[]): readonly VirtualGridSection<BrowserItem>[] => {
  const sections: { key: string; label: string; items: BrowserItem[]; count: number }[] = [];
  for (const row of rows) {
    if (row.expanded !== null) sections.push({ key: row.item.key, label: row.item.name, items: [], count: row.count ?? 0 });
    else if (sections.length === 0) sections.push({ key: 'all', label: '', items: [row.item], count: 0 });
    else sections[sections.length - 1]?.items.push(row.item);
  }
  return sections;
};

export { sectionsOf };
