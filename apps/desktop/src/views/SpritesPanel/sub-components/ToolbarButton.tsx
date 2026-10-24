/* @layer renderer-app @kind component */
import { IconButton } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import type { ToolbarButtonProps } from '../SpritesPanel.type';

const ToolbarButton = ({ hint, disabled, onClick, icon }: ToolbarButtonProps) => (
  <ActionHint hint={hint}>
    <IconButton label={hint.name} size="sm" disabled={disabled} onClick={onClick}>
      {icon}
    </IconButton>
  </ActionHint>
);

export { ToolbarButton };
