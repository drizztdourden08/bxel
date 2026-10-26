/* @layer renderer-app @kind constants */
import type { Section } from '@drizztdourden08/brock-react';
import { CHECKER_PRESET_LABELS, CHECKER_PRESETS, RANGES } from './canvas-look.constants';

const checkerOptions = CHECKER_PRESETS.map((preset) => ({ value: preset, label: CHECKER_PRESET_LABELS[preset] }));

const CANVAS_SECTIONS: Section[] = [
  {
    id: 'checkerboard',
    title: 'Checkerboard',
    items: [
      { key: 'checkerA', label: 'Checkerboard colour A', description: 'The first colour behind transparent pixels.', hint: 'Transparent pixels show a checkerboard of two colours.', control: { kind: 'color' } },
      { key: 'checkerB', label: 'Checkerboard colour B', description: 'The second colour behind transparent pixels.', control: { kind: 'color' } },
      {
        key: 'checkerPreset',
        label: 'Checkerboard cell size',
        description: 'The size of one cell, in screen pixels.',
        hint: 'Pick a size, or Custom to type one. The size stays the same at every zoom.',
        control: { kind: 'choice', options: checkerOptions },
      },
      {
        key: 'checkerSize',
        label: 'Custom cell size',
        description: 'Screen pixels per checkerboard cell.',
        control: { kind: 'number', min: RANGES.checkerSize.min, max: RANGES.checkerSize.max, step: 1, unit: 'px' },
        visible: (settings) => settings.checkerPreset === 'custom',
      },
    ],
  },
];

export { CANVAS_SECTIONS };
