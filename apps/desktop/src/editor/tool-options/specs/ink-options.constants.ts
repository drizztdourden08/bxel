/* @layer renderer-app @kind constants */
import type { DitherPattern } from '@bxel/raster';
import { INK_COMMAND, INK_TOOLS } from '../../../keymap/drawing-command-id.constants';
import type { InkKind, PatternAlign } from '../../../stores/drawing-store.type';
import { inkFor } from '../../../stores/ink-for';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { OptionSpec } from '../tool-options.type';
import { choiceSpec } from './choice-spec';
import { DITHER_PATTERN_CHOICES, DRAWING_TEXT, INK_CHOICES, PATTERN_ALIGN_CHOICES } from './drawing-text.constants';
import { numberSpec } from './number-spec';
import { rampChoices } from './ramp-choices';

const d = () => useDrawingStore.getState();

const SHADING: readonly InkKind[] = ['shade', 'lighten', 'darken'];

const asInk = (value: string): InkKind => (INK_CHOICES.find((choice) => choice.value === value)?.value as InkKind | undefined) ?? 'normal';

const inkChoice = (tool: (typeof INK_TOOLS)[number]): OptionSpec =>
  choiceSpec({
    tool, name: 'ink', label: DRAWING_TEXT.ink, description: DRAWING_TEXT.inkDescription, priority: 50, group: 'ink', default: 'normal', choices: INK_CHOICES,
    command: INK_COMMAND, chord: 'Shift+S', read: () => inkFor(d(), tool), write: (value) => d().setInk(tool, asInk(value)),
  });

const ditherSpecs = (tool: (typeof INK_TOOLS)[number]): OptionSpec[] => [
  choiceSpec({
    tool, name: 'dither_pattern', label: DRAWING_TEXT.ditherPattern, description: DRAWING_TEXT.ditherPatternDescription, priority: 52, group: 'ink', tier: 2,
    default: 'checker', choices: DITHER_PATTERN_CHOICES, read: () => d().ditherPattern, write: (value) => d().patch({ ditherPattern: value as DitherPattern }),
    appliesWhen: () => inkFor(d(), tool) === 'dither',
  }),
  numberSpec({
    tool, name: 'dither_level', label: DRAWING_TEXT.ditherLevel, description: DRAWING_TEXT.ditherLevelDescription, priority: 53, group: 'ink', tier: 2,
    default: 8, min: 1, max: 15, read: () => d().ditherLevel, write: (value) => d().patch({ ditherLevel: value }),
    appliesWhen: () => inkFor(d(), tool) === 'dither' && d().ditherPattern === 'bayer',
  }),
];

const shadeSpecs = (tool: (typeof INK_TOOLS)[number]): OptionSpec[] => [
  numberSpec({
    tool, name: 'shade_steps', label: DRAWING_TEXT.shadeSteps, description: DRAWING_TEXT.shadeStepsDescription, priority: 54, group: 'ink', tier: 2,
    default: 1, min: 1, max: 4, read: () => d().shadeSteps, write: (value) => d().patch({ shadeSteps: value }),
    appliesWhen: () => SHADING.includes(inkFor(d(), tool)),
  }),
  choiceSpec({
    tool, name: 'shade_ramp', label: DRAWING_TEXT.shadeRamp, description: DRAWING_TEXT.shadeRampDescription, priority: 55, group: 'ink', tier: 2,
    default: '', choices: rampChoices, read: () => d().shadeRamp ?? '', write: (value) => d().patch({ shadeRamp: value === '' ? null : value }),
    appliesWhen: () => inkFor(d(), tool) === 'shade',
  }),
];

const patternSpec = (tool: (typeof INK_TOOLS)[number]): OptionSpec =>
  choiceSpec({
    tool, name: 'pattern_align', label: DRAWING_TEXT.patternAlign, description: DRAWING_TEXT.patternAlignDescription, priority: 56, group: 'ink', tier: 2,
    default: 'canvas', choices: PATTERN_ALIGN_CHOICES, read: () => d().patternAlign, write: (value) => d().patch({ patternAlign: value === 'start' ? 'start' : ('canvas' satisfies PatternAlign) }),
    appliesWhen: () => inkFor(d(), tool) === 'pattern',
  });

const INK_OPTIONS: readonly OptionSpec[] = INK_TOOLS.flatMap((tool) => [inkChoice(tool), ...ditherSpecs(tool), ...shadeSpecs(tool), patternSpec(tool)]);

export { INK_OPTIONS };
