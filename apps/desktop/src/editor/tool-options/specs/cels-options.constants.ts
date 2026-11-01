/* @layer renderer-app @kind constants */
import type { CelsChoice } from '../../../stores/drawing-store.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { currentTab } from '../../../workspace/current-tab';
import type { OptionChoice, OptionSpec } from '../tool-options.type';
import { choiceSpec } from './choice-spec';

const CELS_TEXT = {
  label: 'Cels',
  description: 'Which cels one stroke or fill paints in the animation. All selected frames is one undo step.',
  frame: 'This frame',
  frameDescription: 'Paint only the cel of the current frame.',
  selected: 'All selected frames',
  selectedDescription: 'Paint the cel of every frame picked in the timeline, in one undo step.',
} as const;

const CELS_CHOICES: readonly OptionChoice[] = [
  { value: 'frame', label: CELS_TEXT.frame, description: CELS_TEXT.frameDescription, icon: 'pixel-brush-custom' },
  { value: 'selected', label: CELS_TEXT.selected, description: CELS_TEXT.selectedDescription, icon: 'pixel-grid' },
];

const inAnimation = (): boolean => currentTab()?.key.kind === 'animation';

const asCels = (value: string): CelsChoice => (value === 'selected' ? 'selected' : 'frame');

const CELS_OPTIONS: readonly OptionSpec[] = (['pencil', 'eraser', 'fill'] as const).map((tool) =>
  choiceSpec({
    tool,
    name: 'cels',
    label: CELS_TEXT.label,
    description: CELS_TEXT.description,
    priority: 90,
    group: 'cels',
    default: 'frame',
    choices: CELS_CHOICES,
    read: () => useDrawingStore.getState().cels,
    write: (value) => useDrawingStore.getState().patch({ cels: asCels(value) }),
    appliesWhen: inAnimation,
  }),
);

export { CELS_CHOICES, CELS_OPTIONS, CELS_TEXT };
