/* @layer renderer-app @kind logic */
import type { RampStep } from '@drizztdourden08/tessera';
import { swatchMarks } from '../../../editor/swatch-marks';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelModel } from '../PalettePanel.type';
import { cornerMarks } from './corner-marks';
import { usageText } from './usage-text';

const rampSteps = (panel: PanelModel, indices: readonly number[]): RampStep[] =>
  indices.flatMap((index) => {
    const slot = panel.slots[index];
    if (!slot) return [];
    const marks = swatchMarks(index, panel.held);
    return [{ color: slot.hex, marks: cornerMarks(marks), label: PALETTE_PANEL_TEXT.name(slot.label, marks, usageText(panel, index)) }];
  });

export { rampSteps };
