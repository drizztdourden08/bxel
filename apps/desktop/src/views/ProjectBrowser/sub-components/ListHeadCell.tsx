/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import type { Column } from '../ProjectBrowser.type';

const sortNote = (sorted: boolean, descending: boolean): string => {
  if (!sorted) return '';
  return descending ? ', sorted descending' : ', sorted ascending';
};

const ListHeadCell = ({ column }: { readonly column: Column }) => {
  const sort = useBrowserStore((state) => state.sort);
  const sorted = sort.key === column.key && column.label !== BROWSER_TEXT.columnPalette;
  return (
    <Button
      size="sm"
      variant="ghost"
      className={`browser-head__cell ${column.className}`}
      aria-label={`${column.label}${sortNote(sorted, sort.descending)}`}
      icon={sorted ? <Icon name={sort.descending ? 'chevron-down' : 'chevron-up'} size={14} /> : undefined}
      onClick={() => useBrowserStore.getState().setSort({ key: column.key, descending: sorted && !sort.descending })}
    >
      {column.label}
    </Button>
  );
};

export { ListHeadCell };
