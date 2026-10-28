/* @layer renderer-app @kind logic */
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { EditorTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from './palette-panel.constants';
import type { CleanUpKind, PanelOutcome } from './palette-panel.type';
import { reorderSwatches } from './reorder-swatches';

const cleanUpPalette = (target: EditorTarget, kind: CleanUpKind, count: number): PanelOutcome => {
  const unused = kind === 'unused';
  if (count === 0) return { ok: false, message: unused ? PANEL_TEXT.nothingUnused : PANEL_TEXT.noDuplicates };
  const name = unused ? PALETTE_COMMAND_NAME.paletteRemoveUnused : PALETTE_COMMAND_NAME.paletteUniteDuplicates;
  const step = { name, targets: null, options: { bankId: target.bank.id } };
  return reorderSwatches(target, unused ? PANEL_LABEL.removeUnused : PANEL_LABEL.unite, step, unused ? PANEL_TEXT.removed(count) : PANEL_TEXT.united(count));
};

export { cleanUpPalette };
