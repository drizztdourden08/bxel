/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { defaultRampSpan, hexToOklch, RAMP_DEFAULTS } from '@bxel/palette';
import { rampName } from '../../../palette-ramps/ramp-name';
import { SPAN_SCALE } from '../RampBuilderDialog.constants';
import type { BuilderSettings } from '../RampBuilderDialog.type';

const firstSettings = (bank: PaletteBank, baseIndex: number): BuilderSettings => {
  const base = bank.slots[baseIndex];
  const lightness = base?.kind === 'color' ? (hexToOklch(base.rgb)?.l ?? 0.5) : 0.5;
  const span = defaultRampSpan(lightness);
  return {
    baseIndex,
    light: RAMP_DEFAULTS.light,
    dark: RAMP_DEFAULTS.dark,
    hueShift: RAMP_DEFAULTS.hueShift,
    hueMode: RAMP_DEFAULTS.hueMode,
    chromaCurve: RAMP_DEFAULTS.chromaCurve,
    snap: true,
    span: [Math.round(span.dark * SPAN_SCALE), Math.round(span.light * SPAN_SCALE)],
    name: rampName(bank),
  };
};

export { firstSettings };
