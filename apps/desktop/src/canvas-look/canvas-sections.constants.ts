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
  {
    id: 'right-click',
    title: 'Right click',
    items: [
      {
        key: 'canvasRightClick',
        label: 'Right click on the canvas',
        description: 'What a right click does on the canvas and on the palette swatches.',
        hint: 'A right click draws or picks with the back colour. The menu always opens from the Menu key, Shift and F10, or a long press.',
        control: {
          kind: 'choice',
          look: 'radio',
          options: [
            { value: 'back-colour', label: 'Keep the back colour (default)' },
            { value: 'menu', label: 'Open the menu on a click without drag' },
          ],
        },
      },
    ],
  },
];

export { CANVAS_SECTIONS };
