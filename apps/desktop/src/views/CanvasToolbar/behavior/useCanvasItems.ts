/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useSurface } from '../../../hooks/useSurface';
import { hasPart } from '../../../surface/has-part';
import { GROUP_IDS } from '../CanvasToolbar.constants';
import { canvasGroups } from './canvas-groups';
import { usePlaybackItems } from './usePlaybackItems';
import { useScopeItems } from './useScopeItems';
import { useSymmetryItems } from './useSymmetryItems';
import { useTransformItems } from './useTransformItems';
import { useViewItems } from './useViewItems';
import { useZoomItems } from './useZoomItems';

const useCanvasItems = (): ToolbarItem[] => {
  const surface = useSurface();
  const tiled = hasPart(surface, 'tiled');
  const guides = hasPart(surface, 'guides');
  const view = useViewItems().filter((item) => (tiled || item.id !== 'tiled') && (guides || item.id !== 'guides'));
  return canvasGroups(surface, [
    { id: GROUP_IDS.scope, part: null, items: useScopeItems() },
    { id: GROUP_IDS.symmetry, part: 'symmetry', items: useSymmetryItems() },
    { id: GROUP_IDS.view, part: 'view', items: view },
    { id: GROUP_IDS.playback, part: 'playback', items: usePlaybackItems() },
    { id: GROUP_IDS.zoom, part: 'zoom', items: useZoomItems() },
    { id: GROUP_IDS.transform, part: 'transform', items: useTransformItems() },
  ]);
};

export { useCanvasItems };
