/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import type { LayerScope } from '../stores/sprite-store.type';
import { radioItem } from './radio-item';
import { SHEET_TEXT } from './sheet.constants';

const layersGroups = (current: LayerScope, pick: (value: LayerScope) => void): MenuGroup[] => [
  {
    id: 'layers',
    items: [
      radioItem('active', SHEET_TEXT.activeLayer, current, pick),
      radioItem('visible', SHEET_TEXT.visibleLayers, current, pick),
      radioItem('all', SHEET_TEXT.allLayersItem, current, pick),
    ],
  },
];

export { layersGroups };
