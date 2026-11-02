/* @layer renderer-app @kind types */
type LayerScopeChip = 'frame' | 'all';

type LayerThumbSize = 0 | 16 | 24 | 40;

interface LayerFlash {
  id: string;
  tick: number;
}

interface LayerViewSettings {
  selected: readonly string[];
  anchor: string | null;
  filter: string;
  colourFilter: string | null;
  scope: LayerScopeChip;
  renamingId: string | null;
  thumbSize: LayerThumbSize;
  folded: readonly string[];
  highlight: boolean;
  flash: LayerFlash | null;
}

interface LayerViewState extends LayerViewSettings {
  reset: () => void;
  select: (selected: readonly string[], anchor: string | null) => void;
  setFilter: (filter: string) => void;
  setColourFilter: (colour: string | null) => void;
  setScope: (scope: LayerScopeChip) => void;
  setRenaming: (id: string | null) => void;
  setThumbSize: (size: LayerThumbSize) => void;
  toggleFold: (id: string) => void;
  toggleHighlight: () => void;
  setFolded: (id: string, folded: boolean) => void;
  flashLayer: (id: string) => void;
}

export type { LayerFlash, LayerScopeChip, LayerThumbSize, LayerViewSettings, LayerViewState };
