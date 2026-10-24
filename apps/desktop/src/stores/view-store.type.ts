/* @layer renderer-app @kind types */
import type { PixelViewportHandle } from '../views/PixelViewport';

type TileMode = 'off' | 'x' | 'y' | 'both';

interface ViewSettings {
  grid: boolean;
  tiled: TileMode;
  viewport: PixelViewportHandle | null;
}

interface ViewState extends ViewSettings {
  toggleGrid: () => void;
  setTiled: (tiled: TileMode) => void;
  setViewport: (viewport: PixelViewportHandle | null) => void;
}

export type { TileMode, ViewSettings, ViewState };
