/* @layer renderer-app @kind logic */
import type { LayerFlag } from '../editor/layer-flag.type';
import { TILE_LABEL } from './tilemap.constants';

const flagLabel = (flag: LayerFlag): string => (flag === 'visible' ? TILE_LABEL.layerVisible : TILE_LABEL.layerLocked);

export { flagLabel };
