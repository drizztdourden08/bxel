/* @layer renderer-app @kind hook */
import type { VirtualGridHandle, VirtualGridMove } from '@drizztdourden08/tessera';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { PaletteSlot } from '../../../editor/palette-slots.type';
import { useSwatchGridStore } from '../../../stores/useSwatchGridStore';
import { PALETTE_PANEL_TEXT, SWATCH_TILES } from '../PalettePanel.constants';
import type { PanelModel, SwatchGridModel, SwatchGridProps } from '../PalettePanel.type';
import { moveInGrid } from './move-in-grid';
import { revealNewSwatch } from './reveal-new-swatch';
import { wheelSize } from './wheel-size';

const useSwatchGrid = (panel: PanelModel): SwatchGridModel => {
  const handle = useRef<VirtualGridHandle>(null);
  const { target, selection, view, lock } = panel;
  const getKey = useCallback((slot: PaletteSlot) => String(target.bank.slots[slot.index]?.id ?? slot.index), [target.bank]);
  const selected = useMemo(() => new Set([...selection.selected].map((index) => String(target.bank.slots[index]?.id ?? index))), [selection.selected, target.bank]);
  useEffect(() => {
    const grid = handle.current;
    if (!grid) return undefined;
    useSwatchGridStore.getState().attach(grid);
    return () => useSwatchGridStore.getState().detach(grid);
  }, []);
  const reveal =useCallback((index: number) => revealNewSwatch(panel, handle, index), [panel]);
  const props: SwatchGridProps = {
    label: PALETTE_PANEL_TEXT.grid,
    items: panel.slots,
    getKey,
    density: 'swatch',
    tileSize: SWATCH_TILES[view.size],
    selection: { selected, onChange: (keys: ReadonlySet<string>) => selection.replace([...keys]) },
    onWheelSize: (direction: 1 | -1) => {
      const size = wheelSize(view.size, direction);
      if (size !== view.size) view.change({ size });
    },
    onActiveChange: selection.setFocus,
    ...(lock.locked ? {} : { reorder: { onMove: (move: VirtualGridMove) => moveInGrid(panel, move) } }),
  };
  return { handle, props, reveal };
};

export { useSwatchGrid };
