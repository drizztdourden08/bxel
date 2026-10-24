/* @layer tests @kind test */
import { findPreset, presetDefaults } from '@bxel/presets';
import type { BankFacts, PlatformPreset } from '@bxel/presets';

const preset = (id: string): PlatformPreset => {
  const result = findPreset(id);
  if (!result.ok) throw new Error(result.message);
  return result.value;
};

const size = (width: number, height: number): { width: number; height: number } => ({
  width,
  height,
});

const runs = (height: number, columns: readonly (readonly [number, number])[]): Uint8Array => {
  const values = columns.flatMap(([value, count]) => Array.from({ length: count }, () => value));
  return Uint8Array.from(
    { length: values.length * height },
    (_unused, index) => values[index % values.length] ?? 0,
  );
};

const startBank = (id: string): BankFacts => {
  const defaults = presetDefaults(preset(id));
  return {
    id: 'bnk_main',
    name: 'Main',
    cap: defaults.bankSize,
    transparent: defaults.transparent,
    colours: defaults.palette.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : [])),
  };
};

export { preset, runs, size, startBank };
