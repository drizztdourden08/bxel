/* @layer renderer-app @kind constants */
const A11Y_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] as const;

const A11Y_BLOCKING = ['serious', 'critical'] as const;

const A11Y_SAMPLE_LIMIT = 50;

const A11Y_KNOWN_GAPS = [
  { rule: 'aria-required-children', target: '.document-tabs__track', owner: 'Tessera', why: 'DocumentTabs puts the close button inside the tablist next to each tab' },
  { rule: 'label-content-name-mismatch', target: 'aria-label="Step ', owner: 'Tessera', why: 'Stepper names a step "Step 1, Source" while the dot and the label read "1Source" with no space' },
  { rule: 'target-size', target: '.collapse-toggle', owner: 'Tessera', why: 'CollapseToggle is 23.8 px square, the minimum is 24 px' },
] as const;

export { A11Y_BLOCKING, A11Y_KNOWN_GAPS, A11Y_SAMPLE_LIMIT, A11Y_TAGS };
