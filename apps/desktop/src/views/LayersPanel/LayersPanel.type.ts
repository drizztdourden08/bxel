/* @layer renderer-app @kind types */
import type { LayerId } from '@bxel/document';
import type { IconName } from '@drizztdourden08/tessera';

interface LayerAction {
  id: string;
  label: string;
  shortcut: string | null;
  icon: IconName;
  run: () => void;
}

interface LayerRenameProps {
  layerName: string;
  onCommit: (name: string) => void;
  onCancel: () => void;
}

interface LayerRenameState {
  renamingId: LayerId | null;
  begin: (layerId: LayerId) => void;
  finish: () => void;
}

export type { LayerAction, LayerRenameProps, LayerRenameState };
