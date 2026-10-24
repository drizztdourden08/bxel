/* @layer renderer-app @kind component */
import { Box, ListItemRow } from '@drizztdourden08/tessera';
import type { LayerRowProps } from '../LayersPanel.type';
import { LayerGrip } from './LayerGrip';
import { LayerToggles } from './LayerToggles';
import './LayerRow.css';

const LayerRow = ({ item, index, total, selected, tabbable, drag, onSelect, onToggle }: LayerRowProps) => (
  <Box
    as="li"
    className="layer-list__item"
    data-reorder-index={index}
    data-reorder-key={item.id}
    data-drop={drag.dropMark(index, total)}
    data-dragging={drag.dragging === index ? 'yes' : undefined}
  >
    <LayerGrip index={index} drag={drag} />
    <ListItemRow
      className="layer-list__row"
      name={item.label}
      selected={selected}
      tabIndex={tabbable ? 0 : -1}
      onClick={() => onSelect(item.id)}
      action={<LayerToggles name={item.label} state={item.toggles} onToggle={(toggle, next) => onToggle(item.id, toggle, next)} />}
    />
  </Box>
);

export { LayerRow };
