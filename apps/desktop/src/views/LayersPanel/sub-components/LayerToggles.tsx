/* @layer renderer-app @kind component */
import { Box, Icon, IconButton } from '@drizztdourden08/tessera';
import { LAYER_TOGGLES } from '../LayersPanel.constants';
import type { LayerTogglesProps } from '../LayersPanel.type';
import './LayerToggles.css';

const LayerToggles = ({ name, state, onToggle }: LayerTogglesProps) => (
  <Box role="group" aria-label={name} className="layer-list__toggles" data-reorder-toggles>
    {LAYER_TOGGLES.map((toggle) => {
      const on = state[toggle.id];
      return (
        <IconButton
          key={toggle.id}
          variant="ghost"
          size="sm"
          label={toggle.label}
          aria-pressed={on}
          className="layer-list__toggle"
          data-on={on ? 'yes' : 'no'}
          onClick={() => onToggle(toggle.id, !on)}
        >
          <Icon name={on ? toggle.iconOn : toggle.iconOff} size={16} />
        </IconButton>
      );
    })}
  </Box>
);

export { LayerToggles };
