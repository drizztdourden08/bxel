/* @layer renderer-app @kind component */
import { ButtonGroup, Icon, IconButton } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { LAYER_ACTIONS, LAYERS_PANEL_TEXT } from '../LayersPanel.constants';

const LayersToolbar = () => (
  <ButtonGroup aria-label={LAYERS_PANEL_TEXT.actions}>
    {LAYER_ACTIONS.map((action) => (
      <ActionHint key={action.id} hint={action.hint}>
        <IconButton label={action.hint.name} size="sm" onClick={action.run}>
          <Icon name={action.icon} size={16} />
        </IconButton>
      </ActionHint>
    ))}
  </ButtonGroup>
);

export { LayersToolbar };
