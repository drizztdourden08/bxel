/* @layer renderer-app @kind types */
import type { LayerId } from '@bxel/document';
import type { IconName, ReorderDrag } from '@drizztdourden08/tessera';
import type { HintSpec } from '../ActionHint';

interface LayerAction {
  id: string;
  hint: HintSpec;
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

type LayerToggleId = 'visible' | 'locked';

type LayerToggleState = Readonly<Record<LayerToggleId, boolean>>;

interface LayerToggle {
  id: LayerToggleId;
  iconOn: IconName;
  iconOff: IconName;
  hint: HintSpec;
}

interface LayerItem {
  id: LayerId;
  label: string;
  toggles: LayerToggleState;
}

interface LayerListProps {
  items: readonly LayerItem[];
  selectedId: LayerId;
  onSelect: (id: LayerId) => void;
  onMove: (from: number, to: number) => void;
  onToggle: (id: LayerId, toggle: LayerToggleId, next: boolean) => void;
}

interface LayerRowProps {
  item: LayerItem;
  index: number;
  total: number;
  selected: boolean;
  tabbable: boolean;
  drag: ReorderDrag;
  onSelect: (id: LayerId) => void;
  onToggle: (id: LayerId, toggle: LayerToggleId, next: boolean) => void;
}

interface LayerGripProps {
  index: number;
  drag: ReorderDrag;
}

interface LayerTogglesProps {
  name: string;
  state: LayerToggleState;
  onToggle: (toggle: LayerToggleId, next: boolean) => void;
}

interface LayerKeysInput {
  total: number;
  move: (from: number, to: number) => void;
}

export type {
  LayerAction, LayerGripProps, LayerItem, LayerKeysInput, LayerListProps, LayerRenameProps, LayerRenameState, LayerRowProps, LayerToggle,
  LayerTogglesProps,
};
