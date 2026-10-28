/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import type { Point } from '@bxel/document';
import { addSlice } from '../../../sheet/add-slice';
import { clampDelta } from '../../../sheet/clamp-delta';
import { pickSpriteById } from '../../../sheet/pick-sprite-by-id';
import { placeSprites } from '../../../sheet/place-sprites';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClickMemo, SheetDrag, SheetGesture, SheetView } from '../SheetCanvas.type';
import { useGuideGrab } from '../../EditorCanvas/behavior/useGuideGrab';
import { sheetDown } from './sheet-down';
import { snapSheetDelta } from './snap-sheet-delta';
import { sliceBox } from './slice-box';

const useSheetGestures = (viewport: RefObject<PixelViewportHandle | null>, sheet: SheetView, drag: RefObject<SheetDrag | null>): SheetGesture => {
  const memo = useRef<ClickMemo>({ id: null, at: 0 });
  const guide = useGuideGrab(viewport);
  const pointer = (event: { clientX: number; clientY: number }): Point => viewport.current?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 };
  return {
    down: (event) => {
      if (guide.down(event)) return;
      if (event.button !== 0) return;
      sheetDown({ event, at: pointer(event), items: sheet.model.items, drag, memo });
      if (drag.current) event.currentTarget.setPointerCapture(event.pointerId);
    },
    move: (event) => {
      if (guide.move(event)) return;
      const active = drag.current;
      if (!active) return;
      const at = pointer(event);
      drag.current =
        active.kind === 'move'
          ? { ...active, delta: clampDelta(sheet.model.items, active.ids, snapSheetDelta(sheet.model.items, active, { x: at.x - active.start.x, y: at.y - active.start.y }, event.altKey, viewport.current?.view().zoom ?? 1)) }
          : { ...active, end: { x: at.x - active.origin.x, y: at.y - active.origin.y } };
      viewport.current?.redraw();
    },
    up: () => {
      if (guide.up()) return;
      const done = drag.current;
      drag.current = null;
      viewport.current?.redraw();
      if (done?.kind === 'slice') addSlice(done.sprite.id, sliceBox(done.start, done.end, done.sprite));
      else if (done && (done.delta.x !== 0 || done.delta.y !== 0)) placeSprites(done.ids, done.delta);
      else if (done?.pending) pickSpriteById(done.pending, 'replace');
    },
  };
};

export { useSheetGestures };
