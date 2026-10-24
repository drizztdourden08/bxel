/* @layer renderer-app @kind component */
import { Icon, Pressable, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { ListHeadCellProps } from '../SpritesPanel.type';

const ListHeadCell = ({ column, order, onSort }: ListHeadCellProps) => {
  const label = MANAGER_TEXT.columns[column.label];
  if (column.key === null) {
    return (
      <Text as="span" variant="caption" tone="dim" className="sprites-panel__head-cell">
        {label}
      </Text>
    );
  }
  return (
    <Pressable type="button" className="sprites-panel__head-cell sprites-panel__head-sort" aria-sort={order} onClick={onSort}>
      {label}
      {order === 'none' ? null : <Icon name={order === 'ascending' ? 'arrow-up' : 'arrow-down'} size={12} />}
    </Pressable>
  );
};

export { ListHeadCell };
