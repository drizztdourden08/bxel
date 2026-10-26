/* @layer renderer-app @kind component */
import { Box, Icon, Pressable, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { ListHeadCellProps } from '../SpritesPanel.type';

const ListHeadCell = ({ column, order, onSort }: ListHeadCellProps) => {
  const label = MANAGER_TEXT.columns[column.label];
  if (column.key === null) {
    return (
      <Text as="span" role="columnheader" variant="caption" tone="dim" className="sprites-panel__head-cell">
        {label}
      </Text>
    );
  }
  return (
    <Box role="columnheader" aria-sort={order} className="sprites-panel__head-cell">
      <Pressable type="button" className="sprites-panel__head-sort" onClick={onSort}>
        {label}
        {order === 'none' ? null : <Icon name={order === 'ascending' ? 'arrow-up' : 'arrow-down'} size={12} />}
      </Pressable>
    </Box>
  );
};

export { ListHeadCell };
