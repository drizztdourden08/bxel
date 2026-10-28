/* @layer renderer-app @kind component */
import { Button, Flex, ScrollArea, SearchInput, Stack, Table, TableSection } from '@drizztdourden08/tessera';
import { useMemo, useState } from 'react';
import { applyListOrder } from '../behavior/apply-list-order';
import { listRows } from '../behavior/list-rows';
import { rampNames } from '../behavior/ramp-names';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { ListSort, PanelProps } from '../PalettePanel.type';
import { ListHead } from './ListHead';
import { ListRow } from './ListRow';

const SwatchList = ({ panel }: PanelProps) => {
  const [sort, setSort] = useState<ListSort>({ key: 'index', direction: 'ascending' });
  const [filter, setFilter] = useState('');
  const rows = useMemo(() => listRows(panel, sort, filter), [panel, sort, filter]);
  const reordered = filter === '' && rows.some((row, at) => row.index !== at);
  return (
    <Stack gap="xs" className="palette-panel__swatches">
      <Flex gap="xs" align="center">
        <SearchInput size="sm" aria-label={PALETTE_PANEL_TEXT.filter} placeholder={PALETTE_PANEL_TEXT.filter} value={filter} onChange={setFilter} />
        {reordered && (
          <Button size="xs" variant="primary" disabled={panel.lock.locked} onClick={() => applyListOrder(panel, rows)}>
            {PALETTE_PANEL_TEXT.applyOrder}
          </Button>
        )}
      </Flex>
      <ScrollArea axis="both" scrollbar="slim" fade={false} className="swatch-list__scroll">
        <Table className="swatch-list" aria-label={PALETTE_PANEL_TEXT.list}>
          <ListHead sort={sort} onSort={setSort} showUse={panel.usage !== null} />
          <TableSection>
            {rows.map((slot) => (
              <ListRow key={slot.index} slot={slot} panel={panel} ramps={rampNames(panel.target.bank, slot.index)} active={panel.selection.focus === slot.index} />
            ))}
          </TableSection>
        </Table>
      </ScrollArea>
    </Stack>
  );
};

export { SwatchList };
