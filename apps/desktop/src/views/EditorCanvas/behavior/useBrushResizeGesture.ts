/* @layer renderer-app @kind hook */
import type { RefObject } from 'react';
import { BRUSH_RESIZE_SLOP } from '../../../editor/brush-resize.constants';
import { brushResizeKeys } from '../../../editor/brush-resize-keys';
import { brushSizeFromDrag } from '../../../editor/brush-size-from-drag';
import { BRUSH_TOOLS } from '../../../editor/tool-options/brush-memory.constants';
import { heldKeys } from '../../../editor/selection/held-keys';
import { PRIMARY_BUTTON } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { brushResizeDraft } from './brush-resize-draft';
import type { SelectGesture } from './canvas-tools.type';
import { pixelAtEvent } from './pixel-at-event';

const useBrushResizeGesture = (viewport: RefObject<PixelViewportHandle | null>): SelectGesture => ({
  down: (event) => {
    const tools = useToolStore.getState();
    if (event.button !== PRIMARY_BUTTON || !BRUSH_TOOLS.includes(tools.tool) || !brushResizeKeys(heldKeys(event))) return false;
    brushResizeDraft.current = { at: pixelAtEvent(viewport.current, event), startX: event.clientX, startSize: tools.brushSize, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
    viewport.current?.redraw();
    return true;
  },
  move: (event) => {
    const draft = brushResizeDraft.current;
    if (!draft) return false;
    const dx = event.clientX - draft.startX;
    draft.moved = draft.moved || Math.abs(dx) > BRUSH_RESIZE_SLOP;
    useToolStore.getState().setBrushSize(brushSizeFromDrag(draft.startSize, dx));
    viewport.current?.redraw();
    return true;
  },
  up: () => {
    if (!brushResizeDraft.current) return false;
    brushResizeDraft.current = null;
    viewport.current?.redraw();
    return true;
  },
});

export { useBrushResizeGesture };
