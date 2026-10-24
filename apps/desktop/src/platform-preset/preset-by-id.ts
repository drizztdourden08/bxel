/* @layer renderer-app @kind logic */
import { findPreset } from '@bxel/presets';
import type { PlatformPreset } from '@bxel/presets';

const presetById = (id: string | null | undefined): PlatformPreset | null => {
  if (id === null || id === undefined) return null;
  const found = findPreset(id);
  return found.ok ? found.value : null;
};

export { presetById };
