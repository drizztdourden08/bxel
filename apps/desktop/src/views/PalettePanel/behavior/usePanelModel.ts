/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import type { EditorTarget } from '../../../editor/editor.type';
import { paletteSlots } from '../../../editor/palette-slots';
import { duplicateGroups } from '../../../palette-panel/duplicate-groups';
import { paletteLock } from '../../../palette-panel/palette-lock';
import { paletteSharing } from '../../../palette-panel/palette-sharing';
import { paletteUsage } from '../../../palette-panel/palette-usage';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import type { PanelModel, SwatchEditModel } from '../PalettePanel.type';
import { useHeldColours } from './useHeldColours';
import { usePaletteView } from './usePaletteView';
import { useSwatchSelection } from './useSwatchSelection';

const usePanelModel = (target: EditorTarget, editor: SwatchEditModel): PanelModel | null => {
  const view = useDocumentStore((state) => state.views[target.documentId] ?? null);
  const artwork = view?.state.artwork ?? null;
  const settings = usePaletteView();
  const held = useHeldColours();
  const selection = useSwatchSelection(target.bank);
  const [hinted, setHinted] = useState<number | null>(null);
  const { bank, sprite } = target;
  const slots = useMemo(() => paletteSlots(bank), [bank]);
  const duplicates = useMemo(() => duplicateGroups(bank), [bank]);
  const usage = useMemo(() => (artwork && settings.showUse ? paletteUsage(artwork, bank, sprite, settings.scope) : null), [artwork, bank, sprite, settings.showUse, settings.scope]);
  const lock = useMemo(() => (artwork ? paletteLock(artwork, sprite) : { locked: false, reason: '' }), [artwork, sprite]);
  const sharing = useMemo(() => (artwork ? paletteSharing(artwork, bank.id) : { sprites: [], shared: false }), [artwork, bank.id]);
  if (!artwork) return null;
  return { target, artwork, slots, held, usage, duplicates, lock, sharing, view: settings, selection, editor, hinted, setHinted };
};

export { usePanelModel };
