/* @layer renderer-app @kind constants */
import type { RequestKind } from './palette-change.type';

const pixelWord = (count: number): string => (count === 1 ? '1 pixel' : `${count} pixels`);

const CHANGE_TEXT = {
  titles: { delete: 'Delete swatch', merge: 'Merge swatch', limit: 'Change colour limit', switch: 'Change palette' } satisfies Record<RequestKind, string>,
  pickLabels: { delete: 'Replace with', merge: 'Merge into', limit: 'New limit', switch: 'New palette' } satisfies Record<RequestKind, string>,
  pickHints: {
    delete: 'Pixels using this swatch take the replacement colour.',
    merge: 'Pixels using this swatch take the colour of the swatch you merge into.',
    limit: 'The number of slots the palette holds, counting the transparent slot.',
    switch: 'Each colour keeps its slot number. The sprite takes the colours of the new palette.',
  } satisfies Record<RequestKind, string>,
  noReplacement: 'No replacement',
  chooseOther: 'Choose a replacement swatch first.',
  below: (inUse: number): string => `The new limit is below the ${inUse} colours in use. Merge or delete swatches first.`,
  affects: (count: number, total: number, pixels: number): string =>
    `Affects ${count} of ${total} sprites. ${pixelWord(pixels)} change. This is one undo step.`,
  sprite: 'Sprite',
  frames: 'Frames',
  pixels: 'Pixels',
  before: 'Before',
  after: 'After',
  cancel: 'Cancel',
  swatch: (index: number, name: string, hex: string): string => (hex === '' ? `Swatch ${index}, ${name}` : `Swatch ${index} ${name}, ${hex}`),
  swatchOption: (index: number, name: string): string => `Swatch ${index}, ${name}`,
  transparentName: 'transparent',
  apply: {
    delete: (pixels: number): string => (pixels > 0 ? `Delete swatch and recolor ${pixelWord(pixels)}` : 'Delete swatch'),
    merge: (pixels: number): string => (pixels > 0 ? `Merge swatches and recolor ${pixelWord(pixels)}` : 'Merge swatches'),
    limit: (): string => 'Change limit',
    switch: (): string => 'Change palette',
  },
  done: {
    delete: 'Deleted the swatch.',
    merge: 'Merged the swatches.',
    limit: 'Changed the colour limit.',
    switch: 'Changed the palette.',
  } satisfies Record<RequestKind, string>,
  failed: (reason: string): string => `Could not change the palette. ${reason}`,
  choosePalette: 'Choose the palette the sprite moves to.',
  samePalette: (name: string): string => `The sprite already uses ${name}.`,
  fewer: (name: string, needed: number): string => `The palette ${name} has fewer slots than the ${needed} the sprite uses.`,
  noFile: 'Open or create a file first.',
  fixedSlot: 'Slot 0 stays where it is. Choose another swatch.',
  slots: (used: number, cap: number): string => `${used} of ${cap} slots used`,
  same: (cap: number): string => `The limit is already ${cap}.`,
  noOther: 'This palette has no other swatch to use.',
  shared: (name: string): string => `Palette ${name}`,
} as const;

const CHANGE_LABEL = {
  delete: 'Delete swatch',
  merge: 'Merge swatches',
  limit: 'Change colour limit',
  switch: 'Change sprite palette',
} satisfies Record<RequestKind, string>;

const FRAME_JOIN = ', ';

const FRAME_RANGE = ' to ';

export { CHANGE_LABEL, CHANGE_TEXT, FRAME_JOIN, FRAME_RANGE };
