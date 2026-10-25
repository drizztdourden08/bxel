/* @layer renderer-app @kind logic */
import type { PlatformPreset } from '@bxel/presets';
import { PLATFORM_TEXT } from './platform-preset.constants';

const slot0Text = (preset: PlatformPreset): string => {
  const { slot0, slot0Shared } = preset.banks;
  if (slot0 === 'background' && slot0Shared) return PLATFORM_TEXT.shared;
  return PLATFORM_TEXT.slot0[slot0];
};

const rulesLine = (preset: PlatformPreset, named = true): string => {
  const line = PLATFORM_TEXT.rules(preset.banks.size, slot0Text(preset), preset.banks.count);
  return named ? `${preset.name}: ${line}` : `${line.charAt(0).toUpperCase()}${line.slice(1)}`;
};

export { rulesLine };
