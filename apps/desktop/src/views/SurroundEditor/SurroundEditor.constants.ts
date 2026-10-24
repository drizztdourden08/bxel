/* @layer renderer-app @kind constants */
import { SURROUND_KINDS, SURROUND_LABELS } from '../../canvas-look/canvas-look.constants';
const EDITOR_INK_TOKEN = '--c-primary';

const EDITOR_INK_FALLBACK = 'white';

const SURROUND_OPTIONS = SURROUND_KINDS.map((kind) => ({ value: kind, label: SURROUND_LABELS[kind] }));

const SURROUND_EDITOR_TEXT = {
  kindLabel: 'Pattern',
  hint: 'Click or drag cells to switch them between the two surround colours. Editing a cell makes the pattern Custom. The colours and the pattern size are set in the Canvas settings.',
  previewLabel: 'Preview of the canvas surround',
  editorLabel: 'Custom pattern editor, 16 by 16 cells',
  previewTitle: 'Preview',
  editorTitle: 'Custom pattern',
  clear: 'Clear',
  invert: 'Invert',
  copyChosen: 'Copy the chosen pattern',
} as const;

export { EDITOR_INK_FALLBACK, EDITOR_INK_TOKEN, SURROUND_EDITOR_TEXT, SURROUND_OPTIONS };
