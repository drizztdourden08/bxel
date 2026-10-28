/* @layer renderer-app @kind constants */
const OPTION_CONTROLS_TEXT = {
  reset: 'Reset',
  previewLabel: (size: number, shape: string): string => `Brush preview, ${size} pixels, ${shape}`,
  sizeOnly: 'Larger brushes are drawn scaled down.',
} as const;

const PREVIEW_CELLS = 16;

export { OPTION_CONTROLS_TEXT, PREVIEW_CELLS };
