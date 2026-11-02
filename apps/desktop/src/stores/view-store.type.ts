/* @layer renderer-app @kind types */
import type { PixelViewportHandle } from '../views/PixelViewport';

type TileMode = 'off' | 'x' | 'y' | 'both';

type ViewToggle = 'grid' | 'gridMajor' | 'gridTile' | 'gridIso' | 'guides' | 'rulers' | 'snap' | 'slices' | 'hideOverlays' | 'mirror' | 'loupe' | 'backgroundPreview' | 'fullscreen' | 'split' | 'splitLink' | 'splitActual' | 'lockGuides';

interface ViewToggles {
  grid: boolean;
  gridMajor: boolean;
  gridTile: boolean;
  gridIso: boolean;
  guides: boolean;
  rulers: boolean;
  snap: boolean;
  slices: boolean;
  hideOverlays: boolean;
  mirror: boolean;
  loupe: boolean;
  backgroundPreview: boolean;
  fullscreen: boolean;
  split: boolean;
  splitLink: boolean;
  splitActual: boolean;
  lockGuides: boolean;
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
  guideColourY: string;
  viewport: PixelViewportHandle | null;
}

interface ViewState extends ViewSettings {
  toggleView: (toggle: ViewToggle) => void;
  setToggles: (toggles: Partial<ViewToggles>) => void;
  setTiled: (tiled: TileMode) => void;
  setGuideColour: (colour: string, colourY?: string) => void;
  setViewport: (viewport: PixelViewportHandle | null) => void;
}

export type { TileMode, ViewSettings, ViewState, ViewToggle, ViewToggleRow, ViewToggles };
