/* @layer renderer-app @kind types */
import type { AssetKind } from '@bxel/document';

type CreationMode = 'closed' | 'file' | 'sprite';

type CreatableKind = Exclude<AssetKind, 'project'>;

interface CreationState {
  mode: CreationMode;
  kind: CreatableKind | null;
  show: (mode: 'file' | 'sprite', kind?: CreatableKind) => void;
  hide: () => void;
}

export type { CreationState, CreatableKind };
