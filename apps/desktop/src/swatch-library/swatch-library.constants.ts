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
  append: 'Add swatch set colours',
  replace: 'Replace palette colours',
} as const;

const LIBRARY_TEXT = {
  appended: (added: number): string => (added === 1 ? 'Added 1 colour.' : `Added ${added} colours.`),
  replaced: (count: number): string => (count === 1 ? 'Replaced the palette with 1 colour.' : `Replaced the palette with ${count} colours.`),
  droppedLimit: (dropped: number, cap: number): string =>
    dropped === 1 ? `1 colour did not fit the limit of ${cap}.` : `${dropped} colours did not fit the limit of ${cap}.`,
  skipped: (skipped: number): string => (skipped === 1 ? '1 colour was already in the palette.' : `${skipped} colours were already in the palette.`),
  full: (cap: number): string => `The palette is full at ${cap} slots. Raise the limit or replace colours.`,
  nothing: 'Every colour of that set is already in the palette.',
  failed: (reason: string): string => `Could not load the set. ${reason}`,
  noFile: 'Open or create a file first.',
} as const;

export { ADDED_COLOR, KEY_SEPARATOR, LIBRARY_LABEL, LIBRARY_TEXT, NEW_SET_COLORS, NEW_SET_NAME, ORIGIN_LABELS, ORIGIN_ORDER };
