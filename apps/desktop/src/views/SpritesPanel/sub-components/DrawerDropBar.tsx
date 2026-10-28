/* @layer renderer-app @kind component */
import { Flex, Icon, Text } from '@drizztdourden08/tessera';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { useLibraryDrop } from '../behavior/useLibraryDrop';
import { useSheetDragging } from '../behavior/useSheetDragging';
import type { ManagerModelProps } from '../SpritesPanel.type';

const DrawerDropBar = ({ model }: ManagerModelProps) => {
  const dragging = useSheetDragging();
  const drop = useLibraryDrop(model);
  if (!dragging) return null;
  return (
    <Flex align="center" justify="center" gap="xs" className={`sprites-panel__dropbar${drop.over ? ' sprites-panel__dropbar--over' : ''}`} {...drop.bind}>
      <Icon name="archive" size={16} />
      <Text variant="caption">{SHEET_TEXT.library.drop}</Text>
    </Flex>
  );
};

export { DrawerDropBar };
