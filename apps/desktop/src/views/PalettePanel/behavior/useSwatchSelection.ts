/* @layer renderer-app @kind hook */
import type { PaletteBank } from '@bxel/document';
import { useCallback, useMemo, useState } from 'react';
import { usePaletteSelectionStore } from '../../../stores/usePaletteSelectionStore';
import type { PickMode, SelectionModel } from '../PalettePanel.type';
import { selectionRange } from './selection-range';

const useSwatchSelection = (bank: PaletteBank): SelectionModel => {
  const store = usePaletteSelectionStore();
  const [focus, setFocus] = useState(0);
  const ids = useMemo(() => (store.bankId === bank.id ? store.selected : []), [store.bankId, store.selected, bank.id]);
  const selected = useMemo(() => new Set(bank.slots.flatMap((slot, index) => (ids.includes(slot.id) ? [index] : []))), [bank, ids]);
  const anchorIndex = bank.slots.findIndex((slot) => slot.id === store.anchor);

  const pick = useCallback(
    (index: number, mode: PickMode) => {
      const id = bank.slots[index]?.id;
      if (id === undefined) return;
      setFocus(index);
      const { select } = usePaletteSelectionStore.getState();
      if (mode === 'only') select({ bankId: bank.id, selected: [id], anchor: id });
      if (mode === 'toggle') select({ bankId: bank.id, selected: ids.includes(id) ? ids.filter((each) => each !== id) : [...ids, id], anchor: id });
      if (mode === 'extend') select({ bankId: bank.id, selected: selectionRange(bank, anchorIndex < 0 ? index : anchorIndex, index), anchor: store.anchor ?? id });
    },
    [bank, ids, anchorIndex, store.anchor],
  );

  const all = useCallback(() => {
    const every = bank.slots.map((slot) => String(slot.id));
    usePaletteSelectionStore.getState().select({ bankId: bank.id, selected: every, anchor: every[0] ?? null });
  }, [bank]);

  const clear = useCallback(() => usePaletteSelectionStore.getState().clear(), []);

  return { selected, focus: Math.min(focus, Math.max(0, bank.slots.length - 1)), setFocus, pick, all, clear };
};

export { useSwatchSelection };
