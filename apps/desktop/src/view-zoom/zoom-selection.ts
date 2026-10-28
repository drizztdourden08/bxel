/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { useViewStore } from '../stores/useViewStore';
import { selectionRect } from './selection-rect';
import { ZOOM_TEXT } from './view-zoom.constants';

const zoomSelection = (): void => {
  const { viewport } = useViewStore.getState();
  const rect = selectionRect();
  if (!viewport) return;
  if (!rect) {
    useNoticeStore.getState().post(ZOOM_TEXT.noSelection);
    return;
  }
  viewport.zoomToRect(rect);
};

export { zoomSelection };
