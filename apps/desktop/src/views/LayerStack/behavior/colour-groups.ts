/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { TAG_COLOUR_CHOICES } from '../../../timeline/tag-colour.constants';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';

const colourGroups = (current: string | null, pick: (colour: string | null) => void): MenuGroup[] => [
  {
    id: 'colours',
    items: [
      { id: 'colour-none', label: LAYER_STACK_TEXT.noTag, kind: 'radio', checked: current === null, onSelect: () => pick(null) },
      ...TAG_COLOUR_CHOICES.map((choice) => ({
        id: `colour-${choice.hex}`,
        label: choice.name,
        kind: 'radio' as const,
        checked: current === choice.hex,
        onSelect: () => pick(choice.hex),
      })),
    ],
  },
];

export { colourGroups };
