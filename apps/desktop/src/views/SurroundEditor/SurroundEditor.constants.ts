/* @layer renderer-app @kind constants */
const EDITOR_INK_TOKEN = '--c-primary';

const EDITOR_INK_FALLBACK = 'white';

const SURROUND_EDITOR_TEXT = {
  editorLabel: 'Custom pattern editor, 16 by 16 cells',
  toolsLabel: 'Custom pattern tools',
  clear: 'Clear',
  invert: 'Invert',
  copyChosen: 'Start from the chosen pattern',
} as const;

export { EDITOR_INK_FALLBACK, EDITOR_INK_TOKEN, SURROUND_EDITOR_TEXT };
