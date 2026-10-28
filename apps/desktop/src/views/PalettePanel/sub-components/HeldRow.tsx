/* @layer renderer-app @kind component */
import { commands } from '@drizztdourden08/brock-react';
import { Flex, Icon, IconButton } from '@drizztdourden08/tessera';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { HELD_CHIPS, PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';
import { HeldChip } from './HeldChip';

const [first, second, third, fourth] = HELD_CHIPS;

const HeldRow = ({ panel }: PanelProps) => (
  <Flex align="start" gap="2xs" role="group" aria-label={PALETTE_PANEL_TEXT.held} className="palette-panel__held">
    {first && <HeldChip chip={first} panel={panel} />}
    <IconButton label={PALETTE_PANEL_TEXT.swap} size="xs" variant="tertiary" className="palette-panel__swap" onClick={() => commands.run(COMMAND_ID.swapColours)}>
      <Icon name="arrow-left-right" size={12} />
    </IconButton>
    {second && <HeldChip chip={second} panel={panel} />}
    {third && <HeldChip chip={third} panel={panel} />}
    {fourth && <HeldChip chip={fourth} panel={panel} />}
    <IconButton label={PALETTE_PANEL_TEXT.swapPairs} size="xs" variant="tertiary" className="palette-panel__swap" onClick={() => commands.run(COMMAND_ID.swapColourPairs)}>
      <Icon name="arrow-up-down" size={12} />
    </IconButton>
  </Flex>
);

export { HeldRow };
