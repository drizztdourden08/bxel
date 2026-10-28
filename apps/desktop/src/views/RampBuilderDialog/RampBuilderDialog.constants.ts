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
  name: 'Ramp name',
  preview: 'Ramp preview',
  sphere: 'Shaded sphere test of the new ramp',
  stepNew: 'new',
  stepReuses: (index: number): string => `reuses ${index}`,
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

export { BUILDER_TEXT, HUE_MODES, SPAN_SCALE };
