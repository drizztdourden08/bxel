/* @layer renderer-app @kind constants */
import { SELECT_VARIANT_ICONS } from '../../../icons/tool-icons.constants';
import { SELECT_LABELS, SELECT_VARIANTS } from '../../selection/selection.constants';
import { SELECT_DESCRIPTIONS } from '../../tool-descriptions.constants';
import { PAINT_SURFACES } from '../surfaces.constants';
import type { ToolSlot } from '../tool-catalogue.type';

const SELECT_SLOTS: readonly ToolSlot[] = [
  {
    id: 'select',
    group: 'select',
    label: 'Select',
    key: 'm',
    tool: 'select',
    surfaces: PAINT_SURFACES,
    members: SELECT_VARIANTS.map((variant) => ({
      id: `select-${variant}`,
      tool: 'select' as const,
      variant: { kind: 'select' as const, value: variant },
      label: SELECT_LABELS[variant],
      description: SELECT_DESCRIPTIONS[variant],
      icon: SELECT_VARIANT_ICONS[variant],
    })),
  },
  {
    id: 'move',
    group: 'select',
    label: 'Move',
    key: 'v',
    tool: 'move',
    surfaces: PAINT_SURFACES,
    members: [
      { id: 'move', tool: 'move', label: 'Move', description: 'Move the selected pixels. The arrow keys nudge them by one pixel.', icon: 'pixel-move' },
    ],
  },
];

export { SELECT_SLOTS };
