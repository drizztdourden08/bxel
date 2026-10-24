/* @layer renderer-app @kind component */
import { IconButton, Text, Tooltip } from '@drizztdourden08/tessera';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';
import type { ToolButtonProps } from '../ToolRail.type';

const ToolButton = ({ def, active, onSelect }: ToolButtonProps) => {
  const name = TOOL_RAIL_TEXT.name(def.label, def.key);
  return (
    <Tooltip content={name} placement="bottom">
      <IconButton label={name} active={active} onClick={onSelect}>
        <Text as="span" variant="label">{def.key.toUpperCase()}</Text>
      </IconButton>
    </Tooltip>
  );
};

export { ToolButton };
