/* @layer renderer-app @kind hook */
import type { ShortcutKey } from '@drizztdourden08/tessera';
import type { HintSpec } from '../ActionHint.type';
import { useCommandKeys } from './useCommandKeys';

const useHintKeys = (hint: HintSpec): ShortcutKey[] | undefined =>
  useCommandKeys(hint.shortcuts?.find((each) => each.command !== undefined)?.command)[0];

export { useHintKeys };
