/* @layer renderer-app @kind logic */
import { currentCanvasSurface } from '../../canvas-surface/current-canvas-surface';
import { currentTarget } from '../../editor/current-target';
import { useLayerViewStore } from '../../stores/useLayerViewStore';
import { useTilemapStore } from '../../stores/useTilemapStore';

const highlightView = () => {
  const on = useLayerViewStore.getState().highlight;
  const surface = currentCanvasSurface();
  const lit = surface === 'map' ? useTilemapStore.getState().layerId : (currentTarget()?.layerId ?? null);
  return { on, layer: on ? lit : null, surface };
};

export { highlightView };
