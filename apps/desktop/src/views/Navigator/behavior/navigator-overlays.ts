/* @layer renderer-app @kind logic */
import type { NavigatorOverlay } from '@drizztdourden08/tessera';
import type { PixelRect } from '../../PixelViewport';
import { NAVIGATOR_TEXT } from '../Navigator.constants';
import type { ImageRect } from '../Navigator.type';

const navigatorOverlays = (selection: PixelRect | null, other: ImageRect | null): readonly NavigatorOverlay[] => [
  ...(selection ? [{ id: 'selection', kind: 'selection' as const, label: NAVIGATOR_TEXT.selection, rect: selection }] : []),
  ...(other ? [{ id: 'other-view', kind: 'view' as const, label: NAVIGATOR_TEXT.otherView, rect: other }] : []),
];

export { navigatorOverlays };
