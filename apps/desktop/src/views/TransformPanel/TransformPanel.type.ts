/* @layer renderer-app @kind types */
import type { HintSpec } from '../ActionHint';

interface TransformAction {
  id: string;
  hint: HintSpec;
  run: () => void;
}

export type { TransformAction };
