/* @layer renderer-app @kind logic */
import { listPresets } from '@bxel/presets';
import { NO_PLATFORM, PLATFORM_TEXT } from './platform-preset.constants';
import type { PlatformGroup } from './platform-preset.type';

const platformGroups = (): PlatformGroup[] => [
  { label: PLATFORM_TEXT.freeGroup, options: [{ value: NO_PLATFORM, label: PLATFORM_TEXT.none }] },
  ...listPresets().map((family) => ({
    label: family.family,
    options: family.presets.map((preset) => ({ value: preset.id, label: preset.name })),
  })),
];

export { platformGroups };
