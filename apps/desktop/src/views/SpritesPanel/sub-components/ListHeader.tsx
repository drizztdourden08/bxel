/* @layer renderer-app @kind component */
import { Box, Flex } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { sortOrder } from '../behavior/sort-order';
import { LIST_COLUMNS } from '../SpritesPanel.constants';
import { ListHeadCell } from './ListHeadCell';

const ListHeader = () => {
  const sortKey = useManagerStore((state) => state.sortKey);
  const sortDown = useManagerStore((state) => state.sortDown);
  const patch = useManagerStore((state) => state.patch);
  return (
    <Flex role="row" aria-rowindex={1} className="sprites-panel__head">
      <Box role="columnheader" aria-label={MANAGER_TEXT.columns.preview} className="sprites-panel__head-spacer" />
      {LIST_COLUMNS.map((column) => {
        const order = sortOrder(column.key, sortKey, sortDown);
        return (
          <ListHeadCell
            key={column.label}
            column={column}
            order={order}
            onSort={() => column.key && patch({ sortKey: column.key, sortDown: order === 'ascending' })}
          />
        );
      })}
    </Flex>
  );
};

export { ListHeader };
