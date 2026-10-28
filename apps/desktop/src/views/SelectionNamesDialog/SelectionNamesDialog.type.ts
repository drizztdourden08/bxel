/* @layer renderer-app @kind types */
import type { SavedSelection } from '@bxel/document';
import type { CombineMode } from '@bxel/raster';

interface SavedRowProps {
  selection: SavedSelection;
  stale: boolean;
  modeLabels: Readonly<Record<CombineMode, string>>;
}

export type { SavedRowProps };
