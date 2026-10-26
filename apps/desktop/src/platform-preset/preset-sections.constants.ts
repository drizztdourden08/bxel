/* @layer renderer-app @kind constants */
import type { Section } from '@drizztdourden08/brock-react';
import { platformGroups } from './platform-groups';
import { PRESET_FACTS_KEY, PRESET_PICK_KEY } from './platform-preset.constants';
import { presetPickSource } from './preset-pick-source';

const PRESET_OPTIONS = platformGroups()
  .slice(1)
  .flatMap((group) => group.options.map((option) => ({ value: option.value, label: `${group.label}: ${option.label}` })));

const PRESET_SECTIONS: Section[] = [
  {
    id: 'preset',
    title: 'Platform preset',
    source: presetPickSource,
    items: [
      {
        key: PRESET_PICK_KEY,
        label: 'Preset',
        description: 'Pick a preset to see its rules and a preview of it.',
        control: { kind: 'select', options: PRESET_OPTIONS, searchable: true },
      },
      { key: PRESET_FACTS_KEY, label: 'Preset details', noDescription: true, layout: 'wide', chrome: false },
    ],
  },
];

export { PRESET_SECTIONS };
