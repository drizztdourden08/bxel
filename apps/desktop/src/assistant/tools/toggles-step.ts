/* @layer renderer-app @kind logic */
import { useLayerViewStore } from '../../stores/useLayerViewStore';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { useViewStore } from '../../stores/useViewStore';
import type { ViewStep } from './view-steps.type';

const togglesStep: ViewStep = (patch) => {
  const { toggles } = patch;
  if (!toggles) return null;
  const { tiled, onionSkin, highlightLayer, animatedTiles, ...flags } = toggles;
  const view = useViewStore.getState();
  view.setToggles(flags);
  if (tiled !== undefined) view.setTiled(tiled);
  if (onionSkin !== undefined) useTimelineStore.getState().setOnion({ on: onionSkin });
  if (highlightLayer !== undefined) useLayerViewStore.setState({ highlight: highlightLayer });
  if (animatedTiles !== undefined) useTilemapStore.getState().setAnimateTiles(animatedTiles);
  return null;
};

export { togglesStep };
