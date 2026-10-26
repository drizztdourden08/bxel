/* @layer renderer-app @kind constants */
import type { A11yGap } from './a11y.type';

const A11Y_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] as const;

const A11Y_BLOCKING = ['serious', 'critical'] as const;

const A11Y_SAMPLE_LIMIT = 50;

const CORNER_WHY = 'Tessera 0.66 DockLayout corner hit areas are 24px strips along the whole panel edge, so they cover panel content such as New layer, swatches and Add tile. Remove when the hit area is only the corner square.';

const HEADER_WHY = 'Tessera 0.66 widget header buttons are 20px with about 4px between them, which fails the 24px target size. Remove when Tessera draws them at 24px.';

const HEADER_BUTTONS = ['Close Sheet', 'Tileset options', 'Close Tileset'];

const A11Y_KNOWN_GAPS: readonly A11yGap[] = [
<<<<<<< HEAD
  { rule: 'target-size', target: 'corner"]', owner: 'Tessera', why: CORNER_WHY },
  { rule: 'target-size', target: '.dock-corner--row', owner: 'Tessera', why: CORNER_WHY },
  ...WIDGET_BUTTONS.map((name) => ({ rule: 'target-size', target: `"${name}"`, owner: 'Tessera', why: CORNER_WHY })),
=======
  { rule: 'target-size', target: 'partially obscured', owner: 'Tessera', why: CORNER_WHY },
  ...HEADER_BUTTONS.map((name) => ({ rule: 'target-size', target: `"${name}"`, owner: 'Tessera', why: HEADER_WHY })),
>>>>>>> main
];

export { A11Y_BLOCKING, A11Y_KNOWN_GAPS, A11Y_SAMPLE_LIMIT, A11Y_TAGS };
