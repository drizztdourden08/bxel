/* @layer renderer-app @kind component */
import { Box, Icon, VirtualList } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { SortKey } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/browser-context';
import { FileRow } from './FileRow';

type Column = { readonly key: SortKey; readonly label: string; readonly className: string };

const COLUMNS: readonly Column[] = [
  { key: 'name', label: BROWSER_TEXT.columnName, className: 'browser-row__name' },
  { key: 'kind', label: BROWSER_TEXT.columnKind, className: 'browser-row__cell' },
  { key: 'size', label: BROWSER_TEXT.columnSize, className: 'browser-row__cell browser-row__cell--size' },
  { key: 'frames', label: BROWSER_TEXT.columnFrames, className: 'browser-row__cell browser-row__cell--frames' },
  { key: 'name', label: BROWSER_TEXT.columnPalette, className: 'browser-row__cell browser-row__cell--palette' },
  { key: 'folder', label: BROWSER_TEXT.columnFolder, className: 'browser-row__cell browser-row__cell--folder' },
  { key: 'modified', label: BROWSER_TEXT.columnModified, className: 'browser-row__cell browser-row__cell--modified' },
  { key: 'usedBy', label: BROWSER_TEXT.columnUsedBy, className: 'browser-row__cell browser-row__cell--users' },
];

const HeadCell = ({ column }: { readonly column: Column }) => {
  const sort = useBrowserStore((state) => state.sort);
  const sorted = sort.key === column.key && column.label !== BROWSER_TEXT.columnPalette;
  return (
    <button
      type="button"
      className={`browser-head__cell ${column.className}`}
      aria-sort={sorted ? (sort.descending ? 'descending' : 'ascending') : 'none'}
      onClick={() => useBrowserStore.getState().setSort({ key: column.key, descending: sorted && !sort.descending })}
    >
      {column.label}
      {sorted && <Icon name={sort.descending ? 'chevron-down' : 'chevron-up'} size="sm" />}
    </button>
  );
};

/** A table of the same entries. The head sorts; the row is the same pointer target as a tile. */
const ListView = () => {
  const { model } = useBrowserContext();
  return (
    <Box className="browser-list">
      <Box className="browser-head" role="group" aria-label={BROWSER_TEXT.sort}>
        {COLUMNS.map((column) => (
          <HeadCell key={column.label} column={column} />
        ))}
      </Box>
      <VirtualList
        className="browser-list__rows"
        label={BROWSER_TEXT.listLabel}
        items={model.entries}
        getKey={(entry) => entry.id}
        rowSize="compact"
        renderItem={(entry) => <FileRow entry={entry} />}
      />
    </Box>
  );
};

export { ListView };
