/* @layer renderer-app @kind logic */
import type { PanelModel } from '../PalettePanel.type';
import { SWATCH_SELECTOR } from '../PalettePanel.constants';
import { usePaletteSheetStore } from '../../../stores/usePaletteSheetStore';

/** Ctrl and a drop on another swatch: opens the previewed recolour that copies the dragged colour over it. */
const copyDrop = (panel: PanelModel, point: { clientX: number; clientY: number; ctrlKey: boolean }, from: number): boolean => {
  if (!point.ctrlKey) return false;
  const over = document.elementsFromPoint(point.clientX, point.clientY).find((element): element is HTMLElement => element instanceof HTMLElement && element.matches(SWATCH_SELECTOR));
  const to = over ? Number(over.dataset.swatchIndex) : Number.NaN;
  if (Number.isNaN(to) || to === from) return false;
  const { target } = panel;
  usePaletteSheetStore.getState().open({ kind: 'copy', documentId: target.documentId, bankId: target.bank.id, first: from, last: to });
  return true;
};

export { copyDrop };
