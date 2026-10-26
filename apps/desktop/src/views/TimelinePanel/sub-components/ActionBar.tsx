/* @layer renderer-app @kind component */
import { ButtonGroup, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import type { ActionBarProps } from '../TimelinePanel.type';

const ActionBar = ({ label, actions, disabled }: ActionBarProps) => (
  <ButtonGroup aria-label={label}>
    {actions.map((action) => {
      const name = action.shortcut === null ? action.label : `${action.label} (${action.shortcut})`;
      return (
        <Tooltip key={action.id} content={name} placement="top">
          <IconButton label={name} size="sm" disabled={disabled} onClick={() => action.run()}>
            <Icon name={action.icon} />
          </IconButton>
        </Tooltip>
      );
    })}
  </ButtonGroup>
);

export { ActionBar };
