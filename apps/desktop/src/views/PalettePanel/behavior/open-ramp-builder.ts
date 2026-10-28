/* @layer renderer-app @kind logic */
import { useRampBuilderStore } from '../../../stores/useRampBuilderStore';
import type { PanelModel } from '../PalettePanel.type';

const openRampBuilder = (panel: PanelModel, baseIndex?: number): void => {
  const { target, held, selection } = panel;
  const chosen = baseIndex ?? [...selection.selected][0] ?? held.foreground;
  const slot = target.bank.slots[chosen];
  const fallback = target.bank.slots.findIndex((each) => each.kind === 'color');
  useRampBuilderStore.getState().open({ documentId: target.documentId, bankId: target.bank.id, baseIndex: slot?.kind === 'color' ? chosen : fallback });
};

export { openRampBuilder };
