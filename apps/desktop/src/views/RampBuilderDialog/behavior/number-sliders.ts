/* @layer renderer-app @kind logic */
import { RAMP_LIMITS } from '@bxel/palette';
import { BUILDER_TEXT, SPAN_SCALE } from '../RampBuilderDialog.constants';
import type { BuilderState, NumberSlider } from '../RampBuilderDialog.type';

const numberSliders = ({ settings, change }: BuilderState): NumberSlider[] => [
  { label: BUILDER_TEXT.dark, max: RAMP_LIMITS.maxSide, value: settings.dark, set: (dark) => change({ dark }) },
  { label: BUILDER_TEXT.light, max: RAMP_LIMITS.maxSide, value: settings.light, set: (light) => change({ light }) },
  { label: BUILDER_TEXT.spanDark, max: SPAN_SCALE, value: settings.span[0], percent: true, set: (dark) => change({ span: [Math.min(dark, settings.span[1]), settings.span[1]] }) },
  { label: BUILDER_TEXT.spanLight, max: SPAN_SCALE, value: settings.span[1], percent: true, set: (light) => change({ span: [settings.span[0], Math.max(light, settings.span[0])] }) },
];

export { numberSliders };
