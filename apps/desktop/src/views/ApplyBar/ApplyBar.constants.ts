/* @layer renderer-app @kind constants */
const APPLY_BAR_TEXT = {
  region: 'Apply bar',
  targets: (value: string): string => `Targets: ${value}`,
  layers: (value: string): string => `Layers: ${value}`,
  clipping: (value: string): string => `Clipping: ${value}`,
  cancel: 'Cancel',
  apply: 'Apply',
  nudge: 'Arrow keys nudge',
  docked: 'The selection is off screen.',
  details: (parts: readonly string[]): string => parts.join(' / '),
} as const;

const BAR_GAP = 10;

const BAR_MARGIN = 12;

const TEXT_FIELDS = 'input, textarea, select, [contenteditable]';

export { APPLY_BAR_TEXT, BAR_GAP, BAR_MARGIN, TEXT_FIELDS };
