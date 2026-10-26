/* @layer renderer-app @kind constants */
const APPLY_BAR_TEXT = {
  region: 'Apply bar',
  targets: (value: string): string => `Targets: ${value}`,
  layers: (value: string): string => `Layers: ${value}`,
  clipping: (value: string): string => `Clipping: ${value}`,
  cancel: 'Cancel',
  apply: 'Apply',
} as const;

const TEXT_FIELDS = 'input, textarea, select, [contenteditable]';

export { APPLY_BAR_TEXT, TEXT_FIELDS };
