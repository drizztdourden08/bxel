/* @layer renderer-app @kind constants */
import type { SelectionSettings } from './selection-store.type';

const SELECTION_DEFAULTS: SelectionSettings = {
  variant: 'rect',
  mode: 'replace',
  connectivity: 4,
  match: 'exact',
  distance: 32,
  ignoreTransparent: false,
  inSelection: false,
  sample: 'layer',
  amount: 1,
  nudge: 1,
  fixed: 'free',
  fixedWidth: 16,
  fixedHeight: 16,
  mirror: true,
  vertexSnap: 'centre',
  quickMask: false,
  owner: null,
  mask: null,
  draft: null,
  vertices: [],
  clipboard: null,
  systemClip: false,
};

const AMOUNT_LIMIT = 64;

const DISTANCE_LIMIT = 255;

const FIXED_LIMIT = 4096;

export { AMOUNT_LIMIT, DISTANCE_LIMIT, FIXED_LIMIT, SELECTION_DEFAULTS };
