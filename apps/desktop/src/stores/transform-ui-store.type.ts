/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { Handle, TransformField, TransformSpec } from '../editor/transform/transform.type';

interface LastTransform {
  documentId: DocumentId;
  tag: number;
  spec: TransformSpec;
}

interface TransformUiState {
  last: LastTransform | null;
  setLast: (last: LastTransform | null) => void;
  focus: TransformField | null;
  grab: Handle | null;
  angleSnap: number;
  setAngleSnap: (angleSnap: number) => void;
  setFocus: (focus: TransformField | null) => void;
  setGrab: (grab: Handle | null) => void;
}

export type { TransformUiState };
