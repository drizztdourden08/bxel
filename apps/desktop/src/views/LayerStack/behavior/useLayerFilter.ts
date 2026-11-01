/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import { FILTER_FROM_ROWS } from '../LayerStack.constants';
import type { LayerFilterState, LayerRowModel } from '../LayerStack.type';
import { visibleRows } from './visible-rows';

const useLayerFilter = (rows: readonly LayerRowModel[]): LayerFilterState => {
  const text = useLayerViewStore((state) => state.filter);
  const colour = useLayerViewStore((state) => state.colourFilter);
  const folded = useLayerViewStore((state) => state.folded);
  const { setFilter, setColourFilter } = useLayerViewStore.getState();
  const active = rows.length > FILTER_FROM_ROWS;
  const filtered = active && (text.trim() !== '' || colour !== null);
  const shown = useMemo(() => {
    if (!filtered) return visibleRows(rows, folded);
    const needle = text.trim().toLowerCase();
    return rows.filter((row) => row.name.toLowerCase().includes(needle) && (colour === null || row.colour === colour));
  }, [rows, filtered, text, colour, folded]);
  return {
    active,
    filtered,
    shown,
    text,
    colour,
    setText: setFilter,
    setColour: setColourFilter,
    clear: () => {
      setFilter('');
      setColourFilter(null);
    },
  };
};

export { useLayerFilter };
