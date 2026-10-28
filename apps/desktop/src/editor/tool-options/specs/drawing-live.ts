/* @layer renderer-app @kind logic */
import { savedBrushes } from '../../saved-brushes';
import { currentTarget } from '../../current-target';
import { DRAWING_TEXT } from './drawing-text.constants';
import type { OptionChoice } from '../tool-options.type';

const rampChoices = (): OptionChoice[] => [
  { value: '', label: DRAWING_TEXT.autoRamp, description: DRAWING_TEXT.shadeRampDescription, icon: 'pixel-palette' },
  ...(currentTarget()?.bank.ramps ?? []).map((ramp) => ({ value: ramp.name, label: ramp.name, description: DRAWING_TEXT.shadeRampDescription, icon: 'pixel-palette' as const })),
];

const brushChoices = (): OptionChoice[] => [
  { value: '', label: DRAWING_TEXT.noBrush, description: DRAWING_TEXT.customBrushDescription, icon: 'pixel-brush-square' },
  ...savedBrushes().map((brush) => ({ value: brush.id, label: `${brush.name} (${brush.width} by ${brush.height})`, description: DRAWING_TEXT.customBrushDescription, icon: 'pixel-stamp' as const })),
];

export { brushChoices, rampChoices };
