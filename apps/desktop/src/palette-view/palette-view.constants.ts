/* @layer renderer-app @kind constants */
import type { PaletteViewState, SwatchSize } from './palette-view.type';

const PALETTE_VIEW_DEFAULTS: PaletteViewState = { view: 'grid', size: 24, showUse: false, scope: 'palette' };

const SWATCH_SIZES: readonly SwatchSize[] = [16, 24, 32];

export { PALETTE_VIEW_DEFAULTS, SWATCH_SIZES };
