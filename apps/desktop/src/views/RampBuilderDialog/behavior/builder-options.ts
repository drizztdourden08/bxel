/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { RAMP_DEFAULTS } from '@bxel/palette';
import type { RampBuildOptions } from '@bxel/palette';
import { SPAN_SCALE } from '../RampBuilderDialog.constants';
import type { BuilderSettings } from '../RampBuilderDialog.type';

const builderOptions = (bank: PaletteBank, settings: BuilderSettings): RampBuildOptions | null => {
  const base = bank.slots[settings.baseIndex];
  if (base?.kind !== 'color') return null;
  const existing = bank.slots.flatMap((slot, index) => (slot.kind === 'color' ? [{ index, hex: slot.rgb }] : []));
  return {
    base: base.rgb,
    baseIndex: settings.baseIndex,
    light: settings.light,
    dark: settings.dark,
    hueShift: settings.hueShift,
    hueMode: settings.hueMode,
    span: { dark: settings.span[0] / SPAN_SCALE, light: settings.span[1] / SPAN_SCALE },
    chromaCurve: settings.chromaCurve,
    snap: settings.snap ? RAMP_DEFAULTS.snap : 0,
    existing,
  };
};

export { builderOptions };
