/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import { overflowGroups } from '../behavior/overflow-groups';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';

const PaletteOverflow = ({ panel }: PanelProps) => (
  <DropdownMenu
    size="xs"
    variant="tertiary"
    label={PALETTE_PANEL_TEXT.overflow}
    trigger={{ label: PALETTE_PANEL_TEXT.overflow, icon: 'ellipsis-vertical', iconOnly: true }}
    groups={overflowGroups(panel)}
  />
);

export { PaletteOverflow };
