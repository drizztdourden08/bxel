/* @layer renderer-app @kind constants */
import type { SelectionSettings } from './selection-store.type';

const SELECTION_DEFAULTS: SelectionSettings = {
  variant: 'rect',
  mode: 'replace',
  connectivity: 4,
  sample: 'layer',
  amount: 1,
  owner: null,
  mask: null,
  draft: null,
  vertices: [],
  clipboard: null,
  systemClip: false,
};

const AMOUNT_LIMIT = 64;

export { AMOUNT_LIMIT, SELECTION_DEFAULTS };
