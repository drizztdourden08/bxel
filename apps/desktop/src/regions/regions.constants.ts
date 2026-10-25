/* @layer renderer-app @kind constants */
const REGION_SELECTOR =
  '[role="toolbar"], [role="tablist"], [role="application"], [role="region"][aria-label], [role="region"][aria-labelledby], [role="complementary"][aria-label]';

const FOCUS_SELECTOR =
  'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

const ROVING_SELECTOR = '[tabindex="0"]:not(:disabled)';

const MODAL_SELECTOR = '[role="dialog"][aria-modal="true"], [role="alertdialog"], dialog[open]';

const REGION_COMMAND = {
  next: 'view.focus_next_region',
  previous: 'view.focus_previous_region',
} as const;

const REGION_TEXT = {
  next: 'Focus the next region',
  previous: 'Focus the previous region',
} as const;

export { FOCUS_SELECTOR, MODAL_SELECTOR, REGION_COMMAND, REGION_SELECTOR, REGION_TEXT, ROVING_SELECTOR };
