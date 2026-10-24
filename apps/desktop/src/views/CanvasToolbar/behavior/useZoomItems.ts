/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { zoomView } from '../../../editor/zoom-view';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { buttonItem } from '../../../toolbar-items';
import { useHintKeys } from '../../ActionHint';
import { CANVAS_TEXT, ZOOM_ACTUAL_HINT, ZOOM_FIT_HINT } from '../CanvasToolbar.constants';

const useZoomItems = (): ToolbarItem[] => {
  const disabled = useActiveDocument() === null;
  const fitKeys = useHintKeys(ZOOM_FIT_HINT);
  const actualKeys = useHintKeys(ZOOM_ACTUAL_HINT);
  return [
    buttonItem({
      id: 'zoom-fit', icon: 'maximize-2', hint: ZOOM_FIT_HINT, keys: fitKeys, caption: CANVAS_TEXT.fitCaption, disabled, onSelect: () => zoomView('fit'),
    }),
    buttonItem({
      id: 'zoom-actual', icon: 'zoom-in', hint: ZOOM_ACTUAL_HINT, keys: actualKeys, caption: CANVAS_TEXT.actualCaption, disabled, onSelect: () => zoomView('actual'),
    }),
  ];
};

export { useZoomItems };
