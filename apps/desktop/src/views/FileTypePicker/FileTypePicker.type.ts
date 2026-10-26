/* @layer renderer-app @kind types */
import type { CreatableKind } from '../../stores/creation-store.type';

interface FileTypeChoice {
  readonly kind: CreatableKind;
  readonly label: string;
}

export type { FileTypeChoice };
