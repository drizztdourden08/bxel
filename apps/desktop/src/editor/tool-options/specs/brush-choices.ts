/* @layer renderer-app @kind logic */
import { savedBrushes } from '../../saved-brushes';
import type { OptionChoice } from '../tool-options.type';
import { DRAWING_TEXT } from './drawing-text.constants';

const brushChoices = (): OptionChoice[] => [
  { value: '', label: DRAWING_TEXT.noBrush, description: DRAWING_TEXT.customBrushDescription, icon: 'pixel-brush-square' },
  ...savedBrushes().map((brush) => ({ value: brush.id, label: `${brush.name} (${brush.width} by ${brush.height})`, description: DRAWING_TEXT.customBrushDescription, icon: 'pixel-stamp' as const })),
];

export { brushChoices };
