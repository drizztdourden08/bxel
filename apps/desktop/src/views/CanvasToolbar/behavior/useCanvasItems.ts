/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { SEPARATORS } from '../CanvasToolbar.constants';
import { usePlaybackItems } from './usePlaybackItems';
import { useModeItems } from './useModeItems';
import { useSymmetryItems } from './useSymmetryItems';
import { useTransformItems } from './useTransformItems';
import { useViewItems } from './useViewItems';
import { useZoomItems } from './useZoomItems';

const useCanvasItems = (): ToolbarItem[] => [
  ...useModeItems(),
  { kind: 'separator', id: SEPARATORS.mode },
  ...useSymmetryItems(),
  { kind: 'separator', id: SEPARATORS.symmetry },
  ...useViewItems(),
  { kind: 'separator', id: SEPARATORS.view },
  ...usePlaybackItems(),
  { kind: 'separator', id: SEPARATORS.playback },
  ...useZoomItems(),
  { kind: 'separator', id: SEPARATORS.zoom },
  ...useTransformItems(),
];

export { useCanvasItems };
