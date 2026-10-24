/* @layer renderer-app @kind component */
import { IconButton } from '@drizztdourden08/tessera';
import { PixelIcon } from '../../PixelIcon';
import { useToolIcon } from '../../../hooks/useToolIcon';
import type { ToolButtonProps } from '../ToolRail.type';

const ToolIcon = ({ def, active, onSelect }: ToolButtonProps) => {
  const icon = useToolIcon(def.id);
  return (
    <IconButton label={def.label} active={active} onClick={onSelect}>
      <PixelIcon name={icon} />
    </IconButton>
  );
};

export { ToolIcon };
