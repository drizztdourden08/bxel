/* @layer renderer-app @kind logic */
import type { PlatformPreset } from '@bxel/presets';
import { PLATFORM_TEXT } from './platform-preset.constants';

const slot0Text = (preset: PlatformPreset): string => {
  const { slot0, slot0Shared } = preset.banks;
  if (slot0 === 'background' && slot0Shared) return PLATFORM_TEXT.shared;
  return PLATFORM_TEXT.slot0[slot0];
};

const rulesLine = (preset: PlatformPreset): string =>
  PLATFORM_TEXT.rules(preset.name, preset.banks.size, slot0Text(preset), preset.banks.count);

export { rulesLine };
