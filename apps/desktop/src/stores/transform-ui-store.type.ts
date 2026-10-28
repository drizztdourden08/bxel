/* @layer renderer-app @kind types */
import type { Handle, TransformField } from '../editor/transform/transform.type';

interface TransformUiState {
  focus: TransformField | null;
  grab: Handle | null;
  setFocus: (focus: TransformField | null) => void;
  setGrab: (grab: Handle | null) => void;
}

export type { TransformUiState };
