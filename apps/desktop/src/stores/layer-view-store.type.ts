/* @layer renderer-app @kind types */
type LayerScopeChip = 'frame' | 'all';

type LayerThumbSize = 0 | 16 | 24 | 40;

interface LayerViewSettings {
  selected: readonly string[];
  anchor: string | null;
  filter: string;
  colourFilter: string | null;
  scope: LayerScopeChip;
  renamingId: string | null;
  thumbSize: LayerThumbSize;
}

interface LayerViewState extends LayerViewSettings {
  reset: () => void;
  select: (selected: readonly string[], anchor: string | null) => void;
  setFilter: (filter: string) => void;
  setColourFilter: (colour: string | null) => void;
  setScope: (scope: LayerScopeChip) => void;
  setRenaming: (id: string | null) => void;
  setThumbSize: (size: LayerThumbSize) => void;
}

export type { LayerScopeChip, LayerThumbSize, LayerViewSettings, LayerViewState };
