/* @layer renderer-app @kind component */
import { Box, Icon, IconButton } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { LAYER_TOGGLES } from '../LayersPanel.constants';
import type { LayerTogglesProps } from '../LayersPanel.type';
import './LayerToggles.css';

const LayerToggles = ({ name, state, onToggle }: LayerTogglesProps) => (
  <Box role="group" aria-label={name} className="layer-list__toggles" data-reorder-toggles>
    {LAYER_TOGGLES.map((toggle) => {
      const on = state[toggle.id];
      return (
        <ActionHint key={toggle.id} hint={toggle.hint}>
          <IconButton
            variant="ghost"
            size="sm"
            label={toggle.hint.name}
            aria-pressed={on}
            className="layer-list__toggle"
            data-on={on ? 'yes' : 'no'}
            onClick={() => onToggle(toggle.id, !on)}
          >
            <Icon name={on ? toggle.iconOn : toggle.iconOff} size={16} />
          </IconButton>
        </ActionHint>
      );
    })}
  </Box>
);

export { LayerToggles };
