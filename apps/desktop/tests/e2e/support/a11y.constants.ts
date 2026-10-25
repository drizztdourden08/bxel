/* @layer renderer-app @kind constants */
import type { A11yGap } from './a11y.type';

const A11Y_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] as const;

const A11Y_BLOCKING = ['serious', 'critical'] as const;

const A11Y_SAMPLE_LIMIT = 50;

const A11Y_KNOWN_GAPS: readonly A11yGap[] = [
  { rule: 'label-content-name-mismatch', target: ', step ', owner: 'Tessera', why: 'Stepper names a step "Source, step 1" while the dot and the label read "1Source", so the name does not contain the visible text in that order' },
];

export { A11Y_BLOCKING, A11Y_KNOWN_GAPS, A11Y_SAMPLE_LIMIT, A11Y_TAGS };
