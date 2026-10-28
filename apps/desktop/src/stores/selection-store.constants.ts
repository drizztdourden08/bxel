/* @layer renderer-app @kind constants */
import type { SelectionSettings } from './selection-store.type';

const SELECTION_DEFAULTS: SelectionSettings = {
  variant: 'rect',
  mode: 'replace',
  connectivity: 4,
  sample: 'layer',
  owner: null,
  mask: null,
  draft: null,
  vertices: [],
  clipboard: null,
};

export { SELECTION_DEFAULTS };
