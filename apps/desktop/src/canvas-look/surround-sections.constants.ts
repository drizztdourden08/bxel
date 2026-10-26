/* @layer renderer-app @kind constants */
import type { Section } from '@drizztdourden08/brock-react';
import { RANGES, SURROUND_KINDS, SURROUND_LABELS } from './canvas-look.constants';

const surroundOptions = SURROUND_KINDS.map((kind) => ({ value: kind, label: SURROUND_LABELS[kind] }));

const SURROUND_SECTIONS: Section[] = [
  {
    id: 'surround',
    title: 'Surround',
    items: [
      { key: 'surroundPattern', label: 'Surround pattern', description: 'The texture behind the whole work area.', hint: 'Pick a stripe, dot or solid texture, or Custom to use the pattern you draw below.', control: { kind: 'select', options: surroundOptions } },
      { key: 'surroundA', label: 'Surround colour A', description: 'The base colour of the surround.', hint: 'Keep it close to colour B so the texture stays quiet.', control: { kind: 'color' } },
      { key: 'surroundB', label: 'Surround colour B', description: 'The colour of the pattern marks.', control: { kind: 'color' } },
      {
        key: 'surroundScale',
        label: 'Surround pattern size',
        description: 'Screen pixels per pattern cell.',
        hint: 'Larger values make the texture coarser.',
        control: { kind: 'range', min: RANGES.surroundScale.min, max: RANGES.surroundScale.max, step: 1, format: (value: number) => `${value} px` },
      },
    ],
  },
  {
    id: 'surround-custom',
    title: 'Custom pattern',
    items: [
      {
        key: 'canvas.surroundCustom',
        layout: 'wide',
        label: 'Custom pattern',
        description: 'Click or drag cells to switch them between the two surround colours.',
        hint: 'Drawing a cell makes the pattern Custom. The arrow keys move the cell and Space switches it.',
      },
    ],
  },
];

export { SURROUND_SECTIONS };
