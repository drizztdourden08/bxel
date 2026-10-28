/* @layer renderer-app @kind component */
import { Button, Icon, TableCell, TableRow, TableSection } from '@drizztdourden08/tessera';
import { LIST_COLUMNS } from '../PalettePanel.constants';
import type { ListHeadProps } from '../PalettePanel.type';

const ListHead = ({ sort, onSort, showUse }: ListHeadProps) => (
  <TableSection head>
    <TableRow>
      {LIST_COLUMNS.filter((column) => showUse || column.key !== 'use').map((column) => {
        const active = sort.key === column.key;
        const next = active && sort.direction === 'ascending' ? 'descending' : 'ascending';
        return (
          <TableCell key={column.key} header align={column.align} aria-sort={active ? sort.direction : 'none'}>
            <Button size="xs" variant="tertiary" className="swatch-list__sort" onClick={() => onSort({ key: column.key, direction: next })}>
              {column.label}
              {active && <Icon name={sort.direction === 'ascending' ? 'chevron-up' : 'chevron-down'} size={10} />}
            </Button>
          </TableCell>
        );
      })}
    </TableRow>
  </TableSection>
);

export { ListHead };
