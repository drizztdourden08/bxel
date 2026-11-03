/* @layer renderer-app @kind logic */
import type { LayerFlag } from '../../../editor/layer-flag.type';
import type { LayerRowModel } from '../LayerStack.type';

const layerFlagOn = (row: LayerRowModel, flag: LayerFlag): boolean => (flag === 'visible' ? row.visible && !row.mixedVisible : row.lock !== 'none');

export { layerFlagOn };
