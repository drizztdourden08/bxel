/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import type { LayerFlag } from '../../../editor/layer-flag.type';
import type { LayerRowModel, LayerStackModel, LayerSweepView } from '../LayerStack.type';

interface Sweep {
  flag: LayerFlag;
  value: boolean;
  ids: readonly string[];
}

const isOn = (row: LayerRowModel, flag: LayerFlag): boolean => (flag === 'visible' ? row.visible && !row.mixedVisible : row.lock !== 'none');

/**
 * The eye and lock columns. A press on a toggle takes the opposite of its state, and dragging down the column
 * gives every row passed the same state. Letting go commits all of them as one undo step.
 * Alt on the eye shows only that layer, Shift on the eye hides the others, Alt on the lock locks the others.
 */
const useLayerSweep = (model: LayerStackModel, picked: readonly string[]): LayerSweepView => {
  const [sweep, setSweep] = useState<Sweep | null>(null);
  const latest = useRef<{ sweep: Sweep | null; model: LayerStackModel }>({ sweep, model });
  useEffect(() => {
    latest.current = { sweep, model };
  });
  const live = sweep !== null;
  useEffect(() => {
    if (!live) return undefined;
    const commit = (): void => {
      const { sweep: done, model: current } = latest.current;
      setSweep(null);
      if (!done) return;
      const changing = done.ids.filter((id) => {
        const row = current.rows.find((each) => each.id === id);
        return row !== undefined && isOn(row, done.flag) !== done.value;
      });
      if (changing.length > 0) current.actions.setFlag(changing, done.flag, done.value);
    };
    const cancel = (): void => setSweep(null);
    window.addEventListener('pointerup', commit, { once: true });
    window.addEventListener('pointercancel', cancel, { once: true });
    return () => {
      window.removeEventListener('pointerup', commit);
      window.removeEventListener('pointercancel', cancel);
    };
  }, [live]);
  const reach = (row: LayerRowModel): readonly string[] => (picked.length > 1 && picked.includes(row.id) ? picked : [row.id]);
  return {
    pending: (id, flag) => (sweep?.flag === flag && sweep.ids.includes(id) ? sweep.value : undefined),
    handlers: (row, flag) => ({
      onPointerDown: (event) => {
        if (event.button !== 0 || event.altKey || event.shiftKey) return;
        setSweep({ flag, value: !isOn(row, flag), ids: reach(row) });
      },
      onPointerEnter: () => {
        if (sweep?.flag === flag && !sweep.ids.includes(row.id)) setSweep({ ...sweep, ids: [...sweep.ids, row.id] });
      },
      onClick: (event) => {
        if (flag === 'visible' && event.altKey) model.actions.solo(row.id);
        else if (event.altKey && flag === 'locked') model.actions.others(row.id, 'locked');
        else if (event.shiftKey && flag === 'visible') model.actions.others(row.id, 'visible');
        else if (event.detail === 0) model.actions.setFlag(reach(row), flag, !isOn(row, flag));
      },
    }),
  };
};

export { useLayerSweep };
