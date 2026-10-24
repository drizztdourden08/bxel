/* @layer renderer-app @kind component */
import { Anchored, Box, DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuGroup } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { useToolIcon } from '../../../hooks/useToolIcon';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { commandKeys } from '../../ActionHint';
import { PixelIcon } from '../../PixelIcon';
import { useFlyoutOpen } from '../behavior/useFlyoutOpen';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';
import type { ToolFlyoutProps } from '../ToolRail.type';
import { ToolIcon } from './ToolIcon';

const ToolFlyout = ({ def, active, onSelect, groups }: ToolFlyoutProps) => {
  const anchor = useRef<HTMLElement>(null);
  const flyout = useFlyoutOpen();
  const icon = useToolIcon(def.id);
  const entry: MenuGroup = {
    id: 'tool',
    items: [
      {
        id: def.id,
        label: def.label,
        description: def.description,
        icon: <PixelIcon name={icon} />,
        shortcut: commandKeys(COMMAND_ID.tool(def.id))[0],
        kind: 'radio',
        checked: active,
        onSelect,
      },
    ],
  };
  return (
    <Box as="span" ref={anchor} className="tool-flyout" {...flyout.handlers}>
      <ToolIcon def={def} active={active} onSelect={onSelect} />
      {flyout.open && (
        <Anchored anchorRef={anchor} placement="right-start" layer="overlay">
          <DropdownMenu inline label={TOOL_RAIL_TEXT.flyout(def.label)} groups={[entry, ...groups]} onClose={flyout.close} />
        </Anchored>
      )}
    </Box>
  );
};

export { ToolFlyout };
