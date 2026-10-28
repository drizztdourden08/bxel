/* @layer renderer-app @kind types */
import type { PixelViewportHandle } from '../views/PixelViewport';

type TileMode = 'off' | 'x' | 'y' | 'both';

type ViewToggle = 'grid' | 'gridMajor' | 'gridTile' | 'guides' | 'rulers' | 'snap';

interface ViewToggles {
  grid: boolean;
  gridMajor: boolean;
  gridTile: boolean;
  guides: boolean;
  rulers: boolean;
  snap: boolean;
}

interface ViewToggleRow {
  toggle: ViewToggle;
  command: string;
  label: string;
  chord?: string;
}

interface ViewSettings extends ViewToggles {
  tiled: TileMode;
  guideColour: string;
  viewport: PixelViewportHandle | null;
}

interface ViewState extends ViewSettings {
  toggleView: (toggle: ViewToggle) => void;
  setToggles: (toggles: Partial<ViewToggles>) => void;
  setTiled: (tiled: TileMode) => void;
  setGuideColour: (colour: string) => void;
  setViewport: (viewport: PixelViewportHandle | null) => void;
}

export type { TileMode, ViewSettings, ViewState, ViewToggle, ViewToggleRow };
