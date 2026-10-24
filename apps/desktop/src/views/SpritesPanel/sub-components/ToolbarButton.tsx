/* @layer renderer-app @kind component */
import { IconButton, Tooltip } from '@drizztdourden08/tessera';
import type { ToolbarButtonProps } from '../SpritesPanel.type';

const ToolbarButton = ({ label, keys, disabled, onClick, icon }: ToolbarButtonProps) => (
  <Tooltip content={keys ? `${label} (${keys})` : label} placement="bottom">
    <IconButton label={label} size="sm" disabled={disabled} onClick={onClick}>
      {icon}
    </IconButton>
  </Tooltip>
);

export { ToolbarButton };
