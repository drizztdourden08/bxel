/* @layer renderer-app @kind hook */
import type { LayerRowModel, LayerStackModel, LayerSweepView } from '../LayerStack.type';
import { layerFlagOn } from './layer-flag-on';
import { sweepKey } from './layer-sweep-key';
import { useFlagSweep } from './useFlagSweep';

const useLayerSweep = (model: LayerStackModel, rows: readonly LayerRowModel[], picked: readonly string[]): LayerSweepView => {
  const visible = useFlagSweep({ model, rows, picked, flag: 'visible' });
  const locked = useFlagSweep({ model, rows, picked, flag: 'locked' });
  return {
    pending: (id, flag) => {
      const sweep = flag === 'visible' ? visible : locked;
      return sweep.touched.includes(sweepKey(flag, id)) ? (sweep.value ?? undefined) : undefined;
    },
    handlers: (row, flag) => ({
      ...(flag === 'visible' ? visible : locked).bind(sweepKey(flag, row.id), layerFlagOn(row, flag)),
      onClick: (event) => {
        if (flag === 'visible' && event.altKey) model.actions.solo(row.id);
        else if (event.altKey && flag === 'locked') model.actions.others(row.id, 'locked');
        else if (event.shiftKey && flag === 'visible') model.actions.others(row.id, 'visible');
        else if (event.detail === 0) model.actions.setFlag(picked.length > 1 && picked.includes(row.id) ? picked : [row.id], flag, !layerFlagOn(row, flag));
      },
    }),
  };
};

export { useLayerSweep };
