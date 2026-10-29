/* @layer renderer-app @kind logic */
import { currentTarget } from '../../current-target';
import type { OptionChoice } from '../tool-options.type';
import { DRAWING_TEXT } from './drawing-text.constants';

const rampChoices = (): OptionChoice[] => [
  { value: '', label: DRAWING_TEXT.autoRamp, description: DRAWING_TEXT.autoRampDescription, icon: 'pixel-palette' },
  ...(currentTarget()?.bank.ramps ?? []).map((ramp) => ({ value: ramp.name, label: ramp.name, description: DRAWING_TEXT.rampNamed(ramp.name), icon: 'pixel-palette' as const })),
];

export { rampChoices };
