/* @layer renderer-app @kind constants */
import type { EraseMode } from '../../../stores/drawing-store.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { OptionChoice, OptionSpec } from '../tool-options.type';
import { choiceSpec } from './choice-spec';

const ERASE_CHOICES: readonly OptionChoice[] = [
  { value: 'all', label: 'All colours', description: 'The left button clears every pixel under the brush.', icon: 'pixel-eraser' },
  { value: 'colour', label: 'Only colour 2', description: 'The left button clears only pixels of the back colour. The right button swaps the front colour for the back colour.', icon: 'pixel-brush-only-color' },
];

const ERASE_OPTIONS: readonly OptionSpec[] = [
  choiceSpec({
    tool: 'eraser',
    name: 'erase',
    label: 'Erase',
    description: 'Which pixels the left button clears.',
    priority: 40,
    group: 'ink',
    default: 'all',
    choices: ERASE_CHOICES,
    read: () => useDrawingStore.getState().eraseMode,
    write: (value) => useDrawingStore.getState().patch({ eraseMode: (value === 'colour' ? 'colour' : 'all') as EraseMode }),
  }),
];

export { ERASE_OPTIONS };
