/* @layer renderer-app @kind component */
import { IconButton, Tooltip } from '@drizztdourden08/tessera';
import { PixelIcon } from '../../PixelIcon';
import { useToolIcon } from '../../../hooks/useToolIcon';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';
import type { ToolButtonProps } from '../ToolRail.type';

const ToolButton = ({ def, active, onSelect }: ToolButtonProps) => {
  const name = TOOL_RAIL_TEXT.name(def.label, def.key);
  const icon = useToolIcon(def.id);
  return (
    <Tooltip content={name} placement="bottom">
      <IconButton label={name} active={active} onClick={onSelect}>
        <PixelIcon name={icon} />
      </IconButton>
    </Tooltip>
  );
};

export { ToolButton };
