/* @layer renderer-app @kind constants */
import type { A11yGap } from './a11y.type';

const A11Y_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] as const;

const A11Y_BLOCKING = ['serious', 'critical'] as const;

const A11Y_SAMPLE_LIMIT = 50;

const CORNER_WHY = 'Tessera 0.64 DockLayout corner handles are 8px strips that fail target-size and crowd the widget header buttons. Remove when Tessera gives them a 24px hit area clear of the buttons.';

const WIDGET_BUTTONS = ['Timeline options', 'Close Timeline', 'Tileset options', 'Close Tileset', 'Project options', 'Close Project'];

const A11Y_KNOWN_GAPS: readonly A11yGap[] = [
  { rule: 'target-size', target: 'corner"]', owner: 'Tessera', why: CORNER_WHY },
  { rule: 'target-size', target: '.dock-corner--row', owner: 'Tessera', why: CORNER_WHY },
  ...WIDGET_BUTTONS.map((name) => ({ rule: 'target-size', target: `"${name}"`, owner: 'Tessera', why: CORNER_WHY })),
];

export { A11Y_BLOCKING, A11Y_KNOWN_GAPS, A11Y_SAMPLE_LIMIT, A11Y_TAGS };
