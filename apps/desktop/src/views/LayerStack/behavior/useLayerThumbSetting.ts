/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import type { AppSettings } from '../../../settings.type';
import type { LayerThumbSize } from '../../../stores/layer-view-store.type';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';

/** The thumbnail size of the layer list: kept in the settings of the app, shown from the layer view store. */
const useLayerThumbSetting = (): { size: LayerThumbSize; pick: (size: LayerThumbSize) => void } => {
  const { settings, patch, hydrated } = useSettings<AppSettings>();
  const size = useLayerViewStore((state) => state.thumbSize);
  const saved = settings.layerThumbSize;
  useEffect(() => {
    if (hydrated && saved !== undefined) useLayerViewStore.getState().setThumbSize(saved);
  }, [hydrated, saved]);
  return {
    size,
    pick: (next) => {
      useLayerViewStore.getState().setThumbSize(next);
      patch({ layerThumbSize: next });
    },
  };
};

export { useLayerThumbSetting };
