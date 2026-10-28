/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useBxelContext } from '../../../ui-context/useBxelContext';
import { GROUP_IDS } from '../CanvasToolbar.constants';
import { canvasGroups } from './canvas-groups';
import { usePlaybackItems } from './usePlaybackItems';
import { useScopeItems } from './useScopeItems';
import { useSymmetryItems } from './useSymmetryItems';
import { useTransformItems } from './useTransformItems';
import { useViewItems } from './useViewItems';
import { useZoomItems } from './useZoomItems';

const useCanvasItems = (): ToolbarItem[] => {
  const context = useBxelContext((current) => current);
  return canvasGroups(context, [
    { id: GROUP_IDS.scope, items: useScopeItems() },
    { id: GROUP_IDS.symmetry, items: useSymmetryItems() },
    { id: GROUP_IDS.view, items: useViewItems() },
    { id: GROUP_IDS.playback, items: usePlaybackItems() },
    { id: GROUP_IDS.zoom, items: useZoomItems() },
    { id: GROUP_IDS.transform, items: useTransformItems() },
  ]);
};

export { useCanvasItems };
