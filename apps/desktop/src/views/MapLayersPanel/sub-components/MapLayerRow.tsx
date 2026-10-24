/* @layer renderer-app @kind component */
import { Box, Icon, IconButton, ListItemRow } from '@drizztdourden08/tessera';
import { flagMapLayer } from '../../../tilemap/flag-map-layer';
import { ActionHint } from '../../ActionHint';
import { LOCKED_HINT, VISIBLE_HINT } from '../MapLayersPanel.constants';
import type { MapLayerRowProps } from '../MapLayersPanel.type';

const MapLayerRow = ({ layer, selected, onSelect }: MapLayerRowProps) => (
  <Box as="li" className="map-layers__item">
    <ListItemRow
      className="map-layers__row"
      name={layer.name}
      selected={selected}
      onClick={() => onSelect(layer.id)}
      action={
        <Box role="group" aria-label={layer.name} className="map-layers__toggles">
          <ActionHint hint={VISIBLE_HINT}>
            <IconButton variant="ghost" size="sm" label={VISIBLE_HINT.name} aria-pressed={layer.visible} onClick={() => flagMapLayer(layer.id, 'visible', !layer.visible)}>
              <Icon name={layer.visible ? 'eye' : 'eye-off'} size={16} />
            </IconButton>
          </ActionHint>
          <ActionHint hint={LOCKED_HINT}>
            <IconButton variant="ghost" size="sm" label={LOCKED_HINT.name} aria-pressed={layer.locked} onClick={() => flagMapLayer(layer.id, 'locked', !layer.locked)}>
              <Icon name={layer.locked ? 'lock' : 'lock-open'} size={16} />
            </IconButton>
          </ActionHint>
        </Box>
      }
    />
  </Box>
);

export { MapLayerRow };
