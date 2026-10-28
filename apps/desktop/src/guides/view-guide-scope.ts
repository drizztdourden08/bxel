/* @layer renderer-app @kind logic */
import { currentAssetViewKey } from '../asset-view/asset-view-key';
import { currentMap } from '../tilemap/current-map';
import { useSurfaceGuideStore } from '../stores/useSurfaceGuideStore';
import { useViewFeedStore } from '../stores/useViewFeedStore';
import type { GuideAxis, GuideScope } from './guide.type';
import { snapStep } from './snap-step';

const stepOf = (axis: GuideAxis, onMap: boolean): number | null => {
  const tileset = onMap ? currentMap()?.tileset : undefined;
  if (!tileset) return snapStep(axis);
  return axis === 'x' ? tileset.tileWidth : tileset.tileHeight;
};

const viewGuideScope = (key: string, onMap: boolean): GuideScope => ({
  lines: () => useSurfaceGuideStore.getState().guides[key],
  size: () => {
    const { view } = useViewFeedStore.getState();
    return view ? { width: view.imageWidth, height: view.imageHeight } : null;
  },
  step: (axis) => stepOf(axis, onMap),
  add: (axis, position) => useSurfaceGuideStore.getState().add(key, axis, position),
  move: (axis, from, to) => useSurfaceGuideStore.getState().move(key, axis, from, to),
  remove: (axis, position) => useSurfaceGuideStore.getState().remove(key, axis, position),
  clear: () => useSurfaceGuideStore.getState().clear(key),
});

const currentViewGuideScope = (onMap: boolean): GuideScope | null => {
  const key = currentAssetViewKey();
  return key === null ? null : viewGuideScope(key, onMap);
};

export { currentViewGuideScope };
