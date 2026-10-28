/* @layer renderer-app @kind constants */
import type { RampHueMode } from '@bxel/palette';
import type { SegmentOption } from '@drizztdourden08/tessera';

const BUILDER_TEXT = {
  title: 'New ramp',
  base: 'Base colour',
  baseSwatch: (index: number, hex: string): string => `Swatch ${index}, ${hex}`,
  light: 'Steps toward light',
  dark: 'Steps toward dark',
  shift: 'Hue shift per step',
  shiftMode: 'Hue',
  spanDark: 'Darkest lightness',
  spanLight: 'Lightest lightness',
  chroma: 'Chroma drops at both ends',
  snap: 'Reuse swatches that are close',
  snapDistance: 'Match distance',
  percent: (value: number): string => `${value}%`,
  raise: (cap: number): string => `Raise the limit to ${cap}`,
  reuseMore: 'Reuse more',
  raised: (added: number, cap: number): string => `${added} new colours. The limit goes up to ${cap} with the ramp, in the same undo step.`,
  name: 'Ramp name',
  preview: 'Ramp preview',
  sphere: 'Shaded sphere test of the new ramp',
  stepNew: 'new',
  stepReuses: (index: number): string => `#${index}`,
  stepName: (at: number, total: number, reuses: number | null): string => `Step ${at} of ${total}, ${reuses === null ? 'new' : `reuses swatch ${reuses}`}`,
  apply: 'Add ramp',
  cancel: 'Cancel',
  degrees: (value: number): string => `${value} degrees`,
  noBase: 'Choose a colour swatch as the base of the ramp.',
} as const;

const HUE_MODES: SegmentOption<RampHueMode>[] = [
  { value: 'shift', label: 'Warm lights, cool shadows' },
  { value: 'straight', label: 'Straight' },
];

const SPAN_SCALE = 100;

const SNAP_TOP = 20;

const REUSE_MORE = 8;

export { BUILDER_TEXT, HUE_MODES, REUSE_MORE, SNAP_TOP, SPAN_SCALE };
