/* @layer renderer-app @kind component */
import { ButtonGroup, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { PixelIcon } from '../../PixelIcon';
import type { ActionBarProps } from '../TimelinePanel.type';

const ActionBar = ({ label, actions }: ActionBarProps) => (
  <ButtonGroup aria-label={label}>
    {actions.map((action) => {
      const name = action.shortcut === null ? action.label : `${action.label} (${action.shortcut})`;
      return (
        <Tooltip key={action.id} content={name} placement="top">
          <IconButton label={name} size="sm" onClick={() => action.run()}>
            <PixelIcon name={action.icon} />
          </IconButton>
        </Tooltip>
      );
    })}
  </ButtonGroup>
);

export { ActionBar };
