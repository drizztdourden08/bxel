/* @layer renderer-app @kind constants */
import { SPRAY_LIMITS, STABILISER_LIMITS } from '../../../stores/drawing-store.constants';
import type { FillMatch, FillSample, PickSample } from '../../../stores/drawing-store.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { OptionSpec } from '../tool-options.type';
import { choiceSpec } from './choice-spec';
import { DRAWING_TEXT, FILL_MATCH_CHOICES, FILL_SAMPLE_CHOICES, PICK_SAMPLE_CHOICES, SHADE_MODE_CHOICES } from './drawing-text.constants';
import { numberSpec } from './number-spec';
import { rampChoices } from './ramp-choices';
import { toggleSpec } from './toggle-spec';

const d = () => useDrawingStore.getState();

const pickAndFill: OptionSpec[] = [
  choiceSpec({
    tool: 'picker', name: 'sample', label: DRAWING_TEXT.pickSample, description: DRAWING_TEXT.pickSampleDescription, priority: 10, group: 'pick', default: 'visible',
    choices: PICK_SAMPLE_CHOICES, read: () => d().pickSample, write: (value) => d().patch({ pickSample: value as PickSample }),
  }),
  choiceSpec({
    tool: 'fill', name: 'sample', label: DRAWING_TEXT.fillSample, description: DRAWING_TEXT.fillSampleDescription, priority: 30, group: 'area', tier: 2, default: 'layer',
    choices: FILL_SAMPLE_CHOICES, read: () => d().fillSample, write: (value) => d().patch({ fillSample: value as FillSample }),
  }),
  choiceSpec({
    tool: 'fill', name: 'match', label: DRAWING_TEXT.fillMatch, description: DRAWING_TEXT.fillMatchDescription, priority: 31, group: 'area', tier: 2, default: 'index',
    choices: FILL_MATCH_CHOICES, read: () => d().fillMatch, write: (value) => d().patch({ fillMatch: value as FillMatch }),
  }),
];

const seedSpec = (surface: 'paint' | 'map'): OptionSpec =>
  toggleSpec({
    tool: 'spray', name: surface === 'map' ? 'scatter_seed' : 'seed', surface, label: DRAWING_TEXT.spraySeed, description: DRAWING_TEXT.spraySeedDescription,
    priority: 12, group: 'spray', tier: surface === 'map' ? 1 : 2, icon: 'lock', read: () => d().spraySeed !== null, write: (on) => d().patch({ spraySeed: on ? 1 : null }),
  });

const spray: OptionSpec[] = [
  numberSpec({
    tool: 'spray', name: 'size', label: DRAWING_TEXT.sprayRadius, description: DRAWING_TEXT.sprayRadiusDescription, priority: 10, group: 'spray', default: 8,
    min: SPRAY_LIMITS.sizeMin, max: SPRAY_LIMITS.sizeMax, read: () => d().spraySize, write: (value) => d().patch({ spraySize: value }),
  }),
  numberSpec({
    tool: 'spray', name: 'density', label: DRAWING_TEXT.sprayDensity, description: DRAWING_TEXT.sprayDensityDescription, priority: 11, group: 'spray', default: 6,
    min: SPRAY_LIMITS.densityMin, max: SPRAY_LIMITS.densityMax, read: () => d().sprayDensity, write: (value) => d().patch({ sprayDensity: value }),
  }),
  toggleSpec({
    tool: 'spray', name: 'pressure', label: DRAWING_TEXT.sprayPressure, description: DRAWING_TEXT.sprayPressureDescription, priority: 13, group: 'spray', tier: 2,
    default: true, icon: 'pixel-brush-spray', read: () => d().sprayPressure, write: (on) => d().patch({ sprayPressure: on }),
  }),
  seedSpec('paint'),
  seedSpec('map'),
];

const stabiliserSpec = (tool: 'pencil' | 'eraser' | 'shade'): OptionSpec =>
  numberSpec({
    tool, name: 'stabiliser', label: DRAWING_TEXT.stabiliser, description: DRAWING_TEXT.stabiliserDescription, priority: 60, group: 'stroke', tier: tool === 'pencil' ? 1 : 2, default: 0,
    min: STABILISER_LIMITS.min, max: STABILISER_LIMITS.max, read: () => d().stabiliser, write: (value) => d().patch({ stabiliser: value }),
  });

const shade: OptionSpec[] = [
  choiceSpec({
    tool: 'shade', name: 'mode', label: DRAWING_TEXT.shadeMode, description: DRAWING_TEXT.shadeModeDescription, priority: 40, group: 'ink', default: 'shade',
    choices: SHADE_MODE_CHOICES, read: () => d().shadeMode, write: (value) => d().patch({ shadeMode: value === 'lighten' || value === 'darken' ? value : 'shade' }),
  }),
  numberSpec({
    tool: 'shade', name: 'steps', label: DRAWING_TEXT.shadeSteps, description: DRAWING_TEXT.shadeStepsDescription, priority: 41, group: 'ink', default: 1, min: 1, max: 4,
    read: () => d().shadeSteps, write: (value) => d().patch({ shadeSteps: value }),
  }),
  choiceSpec({
    tool: 'shade', name: 'ramp', label: DRAWING_TEXT.shadeRamp, description: DRAWING_TEXT.shadeRampDescription, priority: 42, group: 'ink', default: '', display: 'menu',
    choices: rampChoices, read: () => d().shadeRamp ?? '', write: (value) => d().patch({ shadeRamp: value === '' ? null : value }), appliesWhen: () => d().shadeMode === 'shade',
  }),
];

const TOOL_EXTRA_OPTIONS: readonly OptionSpec[] = [...pickAndFill, ...spray, ...shade, stabiliserSpec('pencil'), stabiliserSpec('eraser'), stabiliserSpec('shade')];

export { TOOL_EXTRA_OPTIONS };
