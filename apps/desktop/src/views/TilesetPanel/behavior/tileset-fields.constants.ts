/* @layer renderer-app @kind constants */
import type { FieldValue, TileFieldKind, TileTurns } from '@bxel/document';

const TURN_CHOICES: readonly { value: TileTurns; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'flips', label: 'Flips' },
  { value: 'all', label: 'Flips and turns' },
];

const FIELD_KINDS: readonly { value: TileFieldKind; label: string }[] = [
  { value: 'bool', label: 'On or off' },
  { value: 'int', label: 'Whole number' },
  { value: 'number', label: 'Number' },
  { value: 'text', label: 'Text' },
  { value: 'choice', label: 'Choice list' },
  { value: 'colour', label: 'Colour' },
];

const FIELD_DEFAULTS: Readonly<Record<TileFieldKind, FieldValue>> = {
  bool: false,
  int: 0,
  number: 0,
  text: '',
  choice: '',
  colour: '#3366cc',
};

const CHIP_COLOURS: readonly string[] = ['--c-primary-bright', '--c-success', '--c-warning', '--c-danger', '--c-info'];

const LAYER_COLOURS: readonly string[] = ['--c-danger', '--c-info', '--c-warning', '--c-success', '--c-primary-bright'];

const SHAPE_KIND_TEXT = { full: 'Full', rect: 'Box', polygon: 'Shape' } as const;

const PAINT_CHOICES = [
  { value: 'select', label: 'Select' },
  { value: 'full', label: 'Paint full' },
  { value: 'last', label: 'Paint last shape' },
] as const;

export { CHIP_COLOURS, FIELD_DEFAULTS, FIELD_KINDS, LAYER_COLOURS, PAINT_CHOICES, SHAPE_KIND_TEXT, TURN_CHOICES };
