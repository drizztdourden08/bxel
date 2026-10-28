/* @layer renderer-app @kind logic */
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { PaletteSortDirection, PaletteSortKey } from '@bxel/palette';
import type { EditorTarget } from '../editor/editor.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { PANEL_LABEL, PANEL_TEXT } from './palette-panel.constants';
import type { PanelOutcome } from './palette-panel.type';
import { paletteSharing } from './palette-sharing';
import { reorderSwatches } from './reorder-swatches';

const sortSwatches = (target: EditorTarget, key: PaletteSortKey, direction: PaletteSortDirection, among: readonly number[] = []): PanelOutcome => {
  const { bank } = target;
  const swatches = among.length > 1 ? among.flatMap((index) => (bank.slots[index] ? [bank.slots[index].id] : [])) : undefined;
  const count = swatches?.length ?? bank.slots.filter((slot, index) => index > 0 && slot.kind === 'color').length;
  const artwork = useDocumentStore.getState().host.view(target.documentId)?.state.artwork;
  const sharing = artwork ? paletteSharing(artwork, bank.id) : null;
  const done = sharing?.shared ? PANEL_TEXT.sortedShared(count, key, sharing.sprites.length) : PANEL_TEXT.sorted(count, key);
  const options = { bankId: bank.id, key, direction, ...(swatches ? { swatches } : {}) };
  return reorderSwatches(target, PANEL_LABEL.sort, { name: PALETTE_COMMAND_NAME.paletteSort, targets: null, options }, done);
};

export { sortSwatches };
