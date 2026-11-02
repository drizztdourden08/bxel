/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuGroup } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useHiddenColumns } from '../../../project-browser/useHiddenColumns';
import { HIDEABLE_COLUMNS } from '../ProjectBrowser.constants';

const ColumnsMenu = () => {
  const hidden = useHiddenColumns((state) => state.hidden);
  const groups: MenuGroup[] = [
    {
      id: 'columns',
      items: HIDEABLE_COLUMNS.map((column) => ({
        id: column.id,
        label: column.label,
        kind: 'check',
        checked: !hidden.includes(column.id),
        onSelect: () => useHiddenColumns.getState().toggle(column.id),
      })),
    },
  ];
  return <DropdownMenu groups={groups} label={BROWSER_TEXT.columnsMenu} trigger={{ label: BROWSER_TEXT.columnsMenu, icon: 'columns-3', iconOnly: true }} size="sm" variant="ghost" />;
};

export { ColumnsMenu };
