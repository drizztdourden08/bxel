/* @layer renderer-app @kind component */
import { ButtonGroup, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { LAYER_ACTIONS, LAYERS_PANEL_TEXT } from '../LayersPanel.constants';

const LayersToolbar = () => (
  <ButtonGroup aria-label={LAYERS_PANEL_TEXT.actions}>
    {LAYER_ACTIONS.map((action) => {
      const name = action.shortcut === null ? action.label : `${action.label} (${action.shortcut})`;
      return (
        <Tooltip key={action.id} content={name} placement="bottom">
          <IconButton label={name} size="sm" onClick={action.run}>
            <Icon name={action.icon} size={16} />
          </IconButton>
        </Tooltip>
      );
    })}
  </ButtonGroup>
);

export { LayersToolbar };
