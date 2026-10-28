/* @layer renderer-app @kind logic */
import type { LayerFlag } from './layer-flag.type';
import type { LayerFields } from './layer-lock.type';
import { lockFields } from './lock-fields';

const flagFields = (flag: LayerFlag, value: boolean): LayerFields => (flag === 'visible' ? { visible: value } : lockFields(value ? 'pixels' : 'none'));

export { flagFields };
