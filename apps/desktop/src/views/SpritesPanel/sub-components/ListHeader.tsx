/* @layer renderer-app @kind component */
import { Flex, Text } from '@drizztdourden08/tessera';
import { useManagerStore } from '../../../stores/useManagerStore';
import { sortOrder } from '../behavior/sort-order';
import { LIST_COLUMNS } from '../SpritesPanel.constants';
import { ListHeadCell } from './ListHeadCell';

const ListHeader = () => {
  const sortKey = useManagerStore((state) => state.sortKey);
  const sortDown = useManagerStore((state) => state.sortDown);
  const patch = useManagerStore((state) => state.patch);
  return (
    <Flex role="row" className="sprites-panel__head">
      <Text as="span" variant="caption" className="sprites-panel__head-spacer" />
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
