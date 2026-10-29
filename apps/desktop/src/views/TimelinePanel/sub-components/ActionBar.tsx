/* @layer renderer-app @kind component */
import { ButtonGroup, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import type { ActionBarProps } from '../TimelinePanel.type';

const ActionBar = ({ label, actions, disabled }: ActionBarProps) => (
  <ButtonGroup aria-label={label}>
    {actions.map((action) => (
      <Tooltip key={action.id} content={action.shortcut === null ? action.label : `${action.label} (${action.shortcut})`} placement="top">
        <IconButton label={action.label} size="sm" disabled={disabled} onClick={() => action.run()}>
          <Icon name={action.icon} />
        </IconButton>
      </Tooltip>
    ))}
  </ButtonGroup>
);

export { ActionBar };
