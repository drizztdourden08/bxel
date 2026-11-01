/* @layer renderer-app @kind constants */
import type { Section } from '@drizztdourden08/brock-react';
import { HOLD_RANGE, SPRING_RANGE } from '../../stores/tool-prefs-store.constants';

const TOOL_PREF_SECTIONS: Section[] = [
  {
    id: 'picking',
    title: 'Picking tools',
    items: [
      {
        key: 'toolOpenOnHover',
        label: 'Open the tool menu on hover',
        description: 'A rail slot with more tools opens its menu when the pointer rests on it.',
        hint: 'Off, the menu opens when you hold the slot or press its arrow.',
      },
      {
        key: 'toolHoldMs',
        label: 'Hold time to open the menu',
        description: 'How long a press on a rail slot lasts before its menu opens.',
        hint: 'A shorter time opens the menu sooner but a slow click may open it by mistake.',
        control: { kind: 'number', min: HOLD_RANGE.min, max: HOLD_RANGE.max, step: HOLD_RANGE.step, unit: 'ms' },
      },
      {
        key: 'toolSpringMs',
        label: 'Hold time to spring back',
        description: 'A tool key held longer than this returns to the previous tool when released.',
        hint: 'A quick tap keeps the new tool. A longer hold borrows it while you keep it pressed.',
        control: { kind: 'number', min: SPRING_RANGE.min, max: SPRING_RANGE.max, step: SPRING_RANGE.step, unit: 'ms' },
      },
    ],
  },
  {
    id: 'brush',
    title: 'Brush',
    items: [
      {
        key: 'toolShareBrush',
        label: 'Share the brush size between tools',
        description: 'The pencil, the eraser and the shape tools use one size and one tip.',
        hint: 'Off, each tool remembers its own brush.',
      },
    ],
  },
];

export { TOOL_PREF_SECTIONS };
