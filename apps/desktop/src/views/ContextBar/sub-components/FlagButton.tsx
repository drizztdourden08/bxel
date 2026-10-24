/* @layer renderer-app @kind component */
import { IconButton } from '@drizztdourden08/tessera';
import { turnCells } from '../../../tilemap/turn-cells';
import { ActionHint } from '../../ActionHint';
import { PixelIcon } from '../../PixelIcon';
import type { FlagButtonProps } from '../ContextBar.type';

const FlagButton = ({ action, on }: FlagButtonProps) => (
  <ActionHint hint={action.hint}>
    <IconButton label={action.hint.name} size="sm" active={on} onClick={() => turnCells(action.op)}>
      <PixelIcon name={action.icon} />
    </IconButton>
  </ActionHint>
);

export { FlagButton };
