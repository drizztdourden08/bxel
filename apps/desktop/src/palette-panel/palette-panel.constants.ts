/* @layer renderer-app @kind constants */
import type { PaletteSortKey } from '@bxel/palette';

const PANEL_LABEL = {
  add: 'Add colour',
  move: 'Move swatch',
  swap: 'Swap swatches',
  sort: 'Sort palette',
  removeUnused: 'Remove unused colours',
  unite: 'Unite duplicate colours',
  detach: 'Detach palette',
  rename: 'Rename swatch',
  ramp: 'New ramp',
  rampEdit: 'Edit ramp',
  rampDelete: 'Delete ramp',
} as const;

const SORT_WORDS: Readonly<Record<PaletteSortKey, string>> = {
  lightness: 'lightness',
  luminance: 'luminance',
  hue: 'hue',
  chroma: 'chroma',
  name: 'name',
  use: 'use count',
  ramp: 'ramp',
};

const PANEL_TEXT = {
  added: (index: number): string => `Added swatch ${index}.`,
  full: (cap: number): string => `The palette holds its ${cap} colours. Raise the limit to add one.`,
  locked: (preset: string): string => `Locked by the ${preset} palette rules.`,
  moved: (index: number, to: number, total: number): string => `Swatch ${index} moved to ${to} of ${total}.`,
  swapped: (first: number, second: number): string => `Swatches ${first} and ${second} swapped. The drawing looks the same.`,
  sorted: (count: number, key: PaletteSortKey): string => `Sorted ${count} swatches by ${SORT_WORDS[key]}. The drawing looks the same.`,
  sortedShared: (count: number, key: PaletteSortKey, sprites: number): string =>
    `Sorted ${count} swatches by ${SORT_WORDS[key]}. All ${sprites} sprites on this palette were remapped and look the same.`,
  ordered: (count: number): string => `Put ${count} swatches in the list order. The drawing looks the same.`,
  removed: (count: number): string => (count === 1 ? 'Removed 1 unused colour.' : `Removed ${count} unused colours.`),
  united: (count: number): string => (count === 1 ? 'United 1 duplicate colour.' : `United ${count} duplicate colours.`),
  detached: (name: string): string => `${name} now has its own palette.`,
  renamed: (name: string): string => `Renamed the swatch to ${name}.`,
  ramp: (name: string, added: number): string => (added === 0 ? `Ramp ${name} made from existing swatches.` : `Ramp ${name} added with ${added} new colours.`),
  rampChanged: (name: string): string => `Ramp ${name} changed.`,
  rampDeleted: (name: string): string => `Ramp ${name} deleted. Its swatches stay.`,
  nothingUnused: 'Every colour is in use.',
  noDuplicates: 'No two swatches have the same colour.',
  fixedSlot: 'The first swatch stays in place.',
} as const;

const SHEET_TEXT = {
  unusedTitle: 'Remove unused colours',
  unusedNote: (count: number): string =>
    count === 0 ? 'Every colour is used by a sprite on this palette.' : `${count} colours are not used by any sprite on this palette. The slots after them move up and the pixels follow, so the drawing looks the same.`,
  uniteTitle: 'Unite duplicate colours',
  uniteNote: (count: number): string =>
    count === 0 ? 'No two swatches have the same colour.' : `${count} swatches repeat an earlier colour. Their pixels move to the first swatch of that colour, so the drawing looks the same.`,
  gradientNote: (first: number, last: number): string => `The swatches between ${first} and ${last} are recoloured in OKLCH. Pixels that use them change colour.`,
  gone: 'Goes',
  before: 'Now',
  after: 'After',
  remove: (count: number): string => (count === 1 ? 'Remove 1 colour' : `Remove ${count} colours`),
  unite: (count: number): string => (count === 1 ? 'Unite 1 colour' : `Unite ${count} colours`),
  recolour: (count: number): string => (count === 1 ? 'Recolour 1 swatch' : `Recolour ${count} swatches`),
  cancel: 'Cancel',
} as const;

const PANEL_COMMAND = {
  add: 'palette.add_colour',
  ramp: 'palette.new_ramp',
  make: 'palette.make_ramp',
  'make-light': 'palette.make_ramp_by_lightness',
  gradient: 'palette.gradient_between',
  unused: 'palette.remove_unused',
  duplicates: 'palette.unite_duplicates',
  sort: 'palette.sort_selection',
} as const;

const PANEL_COMMAND_LABEL = {
  add: 'Add a colour to the palette',
  ramp: 'Build a new hue-shifted ramp',
  make: 'Make a ramp of the selected swatches',
  'make-light': 'Make a ramp of the selected swatches by lightness',
  gradient: 'Recolour the swatches between two as a gradient',
  unused: 'Remove the unused colours',
  duplicates: 'Unite the duplicate colours',
  sort: 'Sort the selected swatches by lightness',
} as const;

const NUDGE_LIGHTNESS = 0.06;

export { NUDGE_LIGHTNESS, PANEL_COMMAND, PANEL_COMMAND_LABEL, PANEL_LABEL, PANEL_TEXT, SHEET_TEXT, SORT_WORDS };
