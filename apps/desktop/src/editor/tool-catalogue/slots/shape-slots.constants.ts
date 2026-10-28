/* @layer renderer-app @kind constants */
import { SHAPE_DESCRIPTIONS } from '../../tool-descriptions.constants';
import { PAINT_SURFACES } from '../surfaces.constants';
import type { ToolSlot } from '../tool-catalogue.type';

const SHAPE_SLOTS: readonly ToolSlot[] = [
  {
    id: 'shape',
    group: 'shape',
    label: 'Shapes',
    key: 'u',
    tool: 'shape',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'line', tool: 'shape', variant: { kind: 'shape', value: 'line' }, label: 'Line', description: SHAPE_DESCRIPTIONS.line, icon: 'pixel-shape-line' },
      {
        id: 'rect',
        tool: 'shape',
        variant: { kind: 'shape', value: 'rect' },
        label: 'Rectangle',
        description: SHAPE_DESCRIPTIONS.rect,
        icon: 'pixel-shape-rect',
        filledIcon: 'pixel-shape-rect-filled',
      },
      {
        id: 'ellipse',
        tool: 'shape',
        variant: { kind: 'shape', value: 'ellipse' },
        label: 'Ellipse',
        description: SHAPE_DESCRIPTIONS.ellipse,
        icon: 'pixel-shape-ellipse',
        filledIcon: 'pixel-shape-ellipse-filled',
      },
    ],
  },
];

export { SHAPE_SLOTS };
