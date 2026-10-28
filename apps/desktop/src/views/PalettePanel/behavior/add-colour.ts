/* @layer renderer-app @kind logic */
import { addSwatch } from '../../../palette-panel/add-swatch';
import { nudgedColour } from '../../../palette-panel/nudged-colour';
import type { PanelModel } from '../PalettePanel.type';
import { reportOutcome } from './report-outcome';

const addColour = (panel: PanelModel): void => {
  const { target, slots, held } = panel;
  const index = target.bank.slots.length;
  const base = slots[held.foreground];
  const outcome = addSwatch(target, nudgedColour(base && !base.transparent ? base.hex : '#808080'));
  reportOutcome(outcome);
  if (!outcome.ok) return;
  requestAnimationFrame(() => {
    const element = document.querySelector<HTMLElement>(`[data-swatch-index="${index}"]`);
    if (element) {
      element.focus();
      panel.selection.setFocus(index);
      panel.editor.open(index, element);
    }
  });
};

export { addColour };
