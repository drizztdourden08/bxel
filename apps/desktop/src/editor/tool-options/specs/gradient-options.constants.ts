/* @layer renderer-app @kind constants */
import type { GradientPattern } from '@bxel/raster';
import type { GradientMode } from '../../../stores/drawing-store.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { OptionSpec } from '../tool-options.type';
import { choiceSpec } from './choice-spec';
import { BAYER_SIZE_CHOICES, DRAWING_TEXT, GRADIENT_KIND_CHOICES, GRADIENT_MODE_CHOICES, GRADIENT_PATTERN_CHOICES } from './drawing-text.constants';
import { rampChoices } from './ramp-choices';
import { toggleSpec } from './toggle-spec';

const d = () => useDrawingStore.getState();

const dithering = (): boolean => d().gradientMode === 'dither';

const asSize = (value: string): 2 | 4 | 8 => {
  if (value === '2') return 2;
  return value === '8' ? 8 : 4;
};

const GRADIENT_OPTIONS: readonly OptionSpec[] = [
  choiceSpec({
    tool: 'gradient', name: 'kind', label: DRAWING_TEXT.gradientKind, description: DRAWING_TEXT.gradientKindDescription, priority: 10, group: 'gradient', default: 'linear',
    choices: GRADIENT_KIND_CHOICES, read: () => d().gradientKind, write: (value) => d().patch({ gradientKind: value === 'radial' ? 'radial' : 'linear' }),
  }),
  choiceSpec({
    tool: 'gradient', name: 'mode', label: DRAWING_TEXT.gradientMode, description: DRAWING_TEXT.gradientModeDescription, priority: 11, group: 'gradient', default: 'bands',
    choices: GRADIENT_MODE_CHOICES, read: () => d().gradientMode, write: (value) => d().patch({ gradientMode: value as GradientMode }),
  }),
  choiceSpec({
    tool: 'gradient', name: 'pattern', label: DRAWING_TEXT.gradientPattern, description: DRAWING_TEXT.gradientPatternDescription, priority: 12, group: 'gradient',
    default: 'bayer', choices: GRADIENT_PATTERN_CHOICES, read: () => d().gradientPattern, write: (value) => d().patch({ gradientPattern: value as GradientPattern }),
    appliesWhen: dithering,
  }),
  choiceSpec({
    tool: 'gradient', name: 'size', label: DRAWING_TEXT.gradientSize, description: DRAWING_TEXT.gradientSizeDescription, priority: 13, group: 'gradient', tier: 2,
    default: '4', choices: BAYER_SIZE_CHOICES, read: () => String(d().gradientSize), write: (value) => d().patch({ gradientSize: asSize(value) }),
    appliesWhen: () => dithering() && d().gradientPattern === 'bayer',
  }),
  toggleSpec({
    tool: 'gradient', name: 'reflect', label: DRAWING_TEXT.gradientReflect, description: DRAWING_TEXT.gradientReflectDescription, priority: 14, group: 'gradient',
    icon: 'pixel-loop', read: () => d().gradientReflect, write: (on) => d().patch({ gradientReflect: on }),
  }),
  choiceSpec({
    tool: 'gradient', name: 'ramp', label: DRAWING_TEXT.gradientRamp, description: DRAWING_TEXT.gradientRampDescription, priority: 15, group: 'gradient', tier: 2,
    default: '', choices: rampChoices, read: () => d().gradientRamp ?? '', write: (value) => d().patch({ gradientRamp: value === '' ? null : value }),
  }),
];

export { GRADIENT_OPTIONS };
