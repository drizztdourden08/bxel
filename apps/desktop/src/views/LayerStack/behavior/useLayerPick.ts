/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import type { LayerStackModel } from '../LayerStack.type';
import { pickLayer } from './pick-layer';
import type { PickHow } from './pick-layer';

interface LayerPick {
  picked: readonly string[];
  pick: (id: string, how: PickHow) => void;
}

/** The rows picked in the list, and what a click on a row does to the pick. */
const useLayerPick = (model: LayerStackModel): LayerPick => {
  const stored = useLayerViewStore((state) => state.selected);
  const { rows, activeId, actions } = model;
  const picked = useMemo(() => {
    const present = rows.map((row) => row.id).filter((id) => stored.includes(id));
    return activeId === null || present.includes(activeId) ? present : [activeId];
  }, [rows, stored, activeId]);
  const pick = useCallback(
    (id: string, how: PickHow) => {
      const { anchor, select } = useLayerViewStore.getState();
      const result = pickLayer({ order: rows.map((row) => row.id), selected: picked, anchor, active: activeId }, id, how);
      select(result.selected, result.anchor);
      if (result.active !== null && result.active !== activeId) actions.activate(result.active);
    },
    [rows, picked, activeId, actions],
  );
  return { picked, pick };
};

export { useLayerPick };
export type { LayerPick };
