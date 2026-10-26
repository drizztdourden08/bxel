/* @layer renderer-app @kind constants */
import { listPresets } from '@bxel/presets';
import { platformGroups } from '../../platform-preset/platform-groups';

const PRESET_BROWSER_TEXT = {
  intro: 'The platform presets that ship with Bxel. You pick one for a project in the Project settings, or for one sprite in the Asset settings.',
  factsLabel: 'Preset details',
  pickLabel: 'Preset',
  previewLabel: 'Preset preview',
} as const;

const PRESET_OPTIONS = platformGroups()
  .slice(1)
  .flatMap((group) => group.options.map((option) => ({ value: option.value, label: `${group.label}: ${option.label}` })));

const FIRST_PRESET = listPresets()[0]?.presets[0]?.id ?? '';

export { FIRST_PRESET, PRESET_BROWSER_TEXT, PRESET_OPTIONS };
