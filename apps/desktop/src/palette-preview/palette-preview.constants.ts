/* @layer renderer-app @kind constants */
const PREVIEW_TEXT = {
  menu: 'Preview with',
  none: 'No other palette fits this sprite.',
  started: 'Previewing the drawing with another palette. Nothing is saved.',
  active: (name: string): string => `Previewing with ${name}. Any edit ends the preview.`,
  end: 'End preview',
} as const;

export { PREVIEW_TEXT };
