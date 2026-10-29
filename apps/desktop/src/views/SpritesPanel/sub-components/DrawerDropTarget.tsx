/* @layer renderer-app @kind component */
import { Box, Icon, Text } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { useLibraryDrop } from '../behavior/useLibraryDrop';
import type { ManagerModelProps } from '../SpritesPanel.type';

const DrawerDropTarget = ({ model }: ManagerModelProps) => {
  const ref = useRef<HTMLElement>(null);
  const over = useLibraryDrop(ref, model);
  return (
    <Box ref={ref} className={`sprites-panel__dropbar${over ? ' sprites-panel__dropbar--over' : ''}`}>
      <Icon name="archive" size={16} />
      <Text variant="caption">{SHEET_TEXT.library.drop}</Text>
    </Box>
  );
};

export { DrawerDropTarget };
