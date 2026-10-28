/* @layer renderer-app @kind constants */
import type { LayerThumbSize, LayerViewSettings } from './layer-view-store.type';

const LAYER_THUMB_SIZES: readonly LayerThumbSize[] = [0, 16, 24, 40];

const LAYER_VIEW_DEFAULTS: LayerViewSettings = {
  selected: [],
  anchor: null,
  filter: '',
  colourFilter: null,
  scope: 'frame',
  renamingId: null,
  thumbSize: 24,
};

export { LAYER_THUMB_SIZES, LAYER_VIEW_DEFAULTS };
