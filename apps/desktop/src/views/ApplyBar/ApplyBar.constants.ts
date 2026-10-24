/* @layer renderer-app @kind constants */
const APPLY_BAR_TEXT = {
  region: 'Apply bar',
  scope: 'Edit scope',
  targets: (value: string): string => `Targets: ${value}`,
  layers: (value: string): string => `Layers: ${value}`,
  frames: (value: string): string => `Frames: ${value}`,
  clipping: (value: string): string => `Clipping: ${value}`,
  cancel: 'Cancel',
  apply: 'Apply',
} as const;

export { APPLY_BAR_TEXT };
