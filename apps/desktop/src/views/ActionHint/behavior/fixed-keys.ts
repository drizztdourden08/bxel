/* @layer renderer-app @kind logic */
import type { ShortcutKey } from '@drizztdourden08/tessera';
import type { HintSpec } from '../ActionHint.type';

const fixedKeys = (spec: HintSpec): readonly ShortcutKey[] | undefined => spec.shortcuts?.find((each) => each.keys !== undefined)?.keys;

export { fixedKeys };
