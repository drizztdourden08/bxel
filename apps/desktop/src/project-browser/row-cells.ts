/* @layer renderer-app @kind logic */
import { KIND_LABEL } from '../asset-list/asset-list.constants';
import { BROWSER_TEXT, EMPTY_CELLS } from './project-browser.constants';
import type { BrowserEntry, RowCells } from './project-browser.type';

const rowCells = (entry: BrowserEntry): RowCells => {
  if (entry.kind === 'folder') return { ...EMPTY_CELLS, kind: BROWSER_TEXT.folderCount(entry.count) };
  const { row, facts } = entry;
  return {
    kind: KIND_LABEL[row.kind],
    size: facts.width !== null && facts.height !== null ? BROWSER_TEXT.pixels(facts.width, facts.height) : '',
    frames: facts.frames === null ? '' : String(facts.frames),
    palette: facts.palette ?? '',
    folder: row.folder,
    modified: row.modified === 0 ? '' : new Date(row.modified).toLocaleDateString(),
    users: facts.usedBy.length > 0 ? String(facts.usedBy.length) : '',
  };
};

export { rowCells };
