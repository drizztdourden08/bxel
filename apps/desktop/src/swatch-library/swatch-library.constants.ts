/* @layer renderer-app @kind constants */
import type { SourceColor } from '../palette-source/palette-source.type';
import type { SetOrigin } from './swatch-library.type';

const KEY_SEPARATOR = ':';

const ORIGIN_LABELS: Readonly<Record<SetOrigin, string>> = {
  builtin: 'Platform presets',
  user: 'My swatch sets',
  project: 'This project',
};

const ORIGIN_ORDER: readonly SetOrigin[] = ['builtin', 'user', 'project'];

const NEW_SET_NAME = 'New set';

const NEW_SET_COLORS: readonly SourceColor[] = [
  { rgb: '#000000', name: '#000000' },
  { rgb: '#ffffff', name: '#ffffff' },
];

const ADDED_COLOR: SourceColor = { rgb: '#808080', name: '#808080' };

const LIBRARY_LABEL = {
  append: 'Add swatch set colors',
  replace: 'Replace palette colors',
} as const;

const LIBRARY_TEXT = {
  appended: (added: number): string => (added === 1 ? 'Added 1 color.' : `Added ${added} colors.`),
  replaced: (count: number): string => (count === 1 ? 'Replaced the palette with 1 color.' : `Replaced the palette with ${count} colors.`),
  droppedLimit: (dropped: number, cap: number): string =>
    dropped === 1 ? `1 color did not fit the limit of ${cap}.` : `${dropped} colors did not fit the limit of ${cap}.`,
  skipped: (skipped: number): string => (skipped === 1 ? '1 color was already in the palette.' : `${skipped} colors were already in the palette.`),
  full: (cap: number): string => `The palette is full at ${cap} slots. Raise the limit or replace colors.`,
  nothing: 'Every color of that set is already in the palette.',
  failed: (reason: string): string => `Could not load the set. ${reason}`,
  noFile: 'Open or create a file first.',
} as const;

export { ADDED_COLOR, KEY_SEPARATOR, LIBRARY_LABEL, LIBRARY_TEXT, NEW_SET_COLORS, NEW_SET_NAME, ORIGIN_LABELS, ORIGIN_ORDER };
