/* @layer renderer-app @kind hook */
import { useToggleSweep } from '@drizztdourden08/tessera';
import type { ToggleSweep } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { layerFlagOn } from './layer-flag-on';
import { sweepIdOf } from './layer-sweep-id';
import { sweepKey } from './layer-sweep-key';
import type { FlagSweepInput } from './useFlagSweep.type';

const useFlagSweep = ({ model, rows, picked, flag }: FlagSweepInput): ToggleSweep => {
  const order = useMemo(() => rows.map((row) => sweepKey(flag, row.id)), [rows, flag]);
  return useToggleSweep({
    order,
    startWhen: (event) => !event.altKey && !event.shiftKey,
    expandStart: (key) => {
      const id = sweepIdOf(flag, key);
      return id !== null && picked.length > 1 && picked.includes(id) ? picked.map((each) => sweepKey(flag, each)) : [key];
    },
    onEnd: (keys, value) => {
      const ids = keys.map((key) => sweepIdOf(flag, key)).filter((id): id is string => id !== null);
      const changing = ids.filter((id) => {
        const row = model.rows.find((each) => each.id === id);
        return row !== undefined && layerFlagOn(row, flag) !== value;
      });
      if (changing.length > 0) model.actions.setFlag(changing, flag, value);
    },
  });
};

export { useFlagSweep };
