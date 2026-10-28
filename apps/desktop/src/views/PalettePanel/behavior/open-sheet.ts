/* @layer renderer-app @kind logic */
import type { SheetKind } from '../../../stores/palette-panel-store.type';
import { usePaletteSheetStore } from '../../../stores/usePaletteSheetStore';
import type { PanelModel } from '../PalettePanel.type';

const openSheet = (panel: PanelModel, kind: SheetKind, first = 0, last = 0): void =>
  usePaletteSheetStore.getState().open({ kind, documentId: panel.target.documentId, bankId: panel.target.bank.id, first, last });

export { openSheet };
