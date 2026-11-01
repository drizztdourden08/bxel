/* @layer renderer-app @kind constants */
import type { PaletteViewKind, PaletteViewState, SwatchSize } from './palette-view.type';

const PALETTE_VIEW_DEFAULTS: PaletteViewState = { view: 'grid', size: 24, showUse: false, scope: 'palette' };

const FILE_VIEW_DEFAULT: PaletteViewKind = 'list';

const SWATCH_SIZES: readonly SwatchSize[] = [16, 24, 32];

export { FILE_VIEW_DEFAULT, PALETTE_VIEW_DEFAULTS, SWATCH_SIZES };
