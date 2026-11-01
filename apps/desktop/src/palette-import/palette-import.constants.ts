/* @layer renderer-app @kind constants */
import type { SegmentOption } from '@drizztdourden08/tessera';
import type { ImportMode } from './palette-import.type';

const IMPORT_TEXT = {
  title: 'Import colours',
  file: 'Choose a palette file...',
  paste: 'Or paste hex colours, one per line',
  pastePlaceholder: '#4a7a3c\n#a7f070',
  modes: 'How to import',
  source: (name: string, count: number): string => `${name}: ${count} ${count === 1 ? 'colour' : 'colours'}`,
  noSource: 'Choose a file or paste some colours to see what an import would do.',
  unreadable: 'No colours were found in that text.',
  present: (count: number): string => (count === 1 ? '1 colour is already in the palette.' : `${count} colours are already in the palette.`),
  over: (count: number, free: number): string =>
    `${count} ${count === 1 ? 'colour does' : 'colours do'} not fit the ${free} free ${free === 1 ? 'slot' : 'slots'}. ${count === 1 ? 'It is' : 'They are'} left out. Raise the colour limit to keep ${count === 1 ? 'it' : 'them'}.`,
  keepLabel: 'Imported',
  presentLabel: 'Already there',
  overLabel: 'Left out',
  cancel: 'Cancel',
  nothing: 'Nothing to import.',
  modeNote: {
    append: 'Adds the colours that are not in the palette yet after the last swatch. Pixels are not touched.',
    replace: 'Puts the colours into the slots in order. Pixels keep their slot, so the drawing takes the new colours.',
    map: 'Moves every pixel to the nearest imported colour, then uses the imported colours as the palette.',
  },
  label: { append: 'Add colours', replace: 'Replace colours by slot', map: 'Map to colours' },
  done: {
    append: (count: number): string => `Added ${count} ${count === 1 ? 'colour' : 'colours'}.`,
    replace: (count: number): string => `Replaced the palette with ${count} ${count === 1 ? 'colour' : 'colours'}.`,
    map: (count: number): string => `Mapped the drawing to ${count} ${count === 1 ? 'colour' : 'colours'}.`,
  },
  apply: {
    append: (count: number): string => (count === 1 ? 'Add 1 colour' : `Add ${count} colours`),
    replace: (count: number): string => (count === 1 ? 'Replace with 1 colour' : `Replace with ${count} colours`),
    map: (count: number): string => (count === 1 ? 'Map to 1 colour' : `Map to ${count} colours`),
  },
} as const;

const IMPORT_MODE_OPTIONS: SegmentOption<ImportMode>[] = [
  { value: 'append', label: 'Add' },
  { value: 'replace', label: 'Replace by slot' },
  { value: 'map', label: 'Map by nearest' },
];

export { IMPORT_MODE_OPTIONS, IMPORT_TEXT };
