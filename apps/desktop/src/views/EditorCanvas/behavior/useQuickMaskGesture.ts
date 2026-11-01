/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import type { Point } from '@bxel/raster';
import { currentTarget } from '../../../editor/current-target';
import { commitSelection } from '../../../editor/selection/commit-selection';
import { quickMaskResult } from '../../../editor/selection/quick-mask';
import { stampQuickMask } from '../../../editor/selection/stamp-quick-mask';
import { selectionMask } from '../../../editor/selection/selection-mask';
import { PRIMARY_BUTTON } from '../../../editor/tools.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { SelectGesture } from './canvas-tools.type';
import { pixelAtEvent } from './pixel-at-event';
import type { QuickMaskPress } from './useQuickMaskGesture.type';

const paintsMask = (tool: string): boolean => tool === 'pencil' || tool === 'eraser';

const useQuickMaskGesture = (viewport: RefObject<PixelViewportHandle | null>): SelectGesture => {
  const press = useRef<QuickMaskPress | null>(null);
  const step = (held: QuickMaskPress, to: Point, redraw: boolean): void => {
    stampQuickMask(held.scratch, held.size, [held.last, to], useToolStore.getState());
    held.last = to;
    useSelectionStore.getState().setDraft(quickMaskResult(held.base, held.scratch, held.size, held.erase));
    if (redraw) viewport.current?.redraw();
  };
  return {
    down: (event) => {
      const tool = useToolStore.getState().tool;
      const target = currentTarget();
      if (!useSelectionStore.getState().quickMask || event.button !== PRIMARY_BUTTON || !paintsMask(tool) || !target) return false;
      const size = { width: target.sprite.width, height: target.sprite.height };
      const at = pixelAtEvent(viewport.current, event);
      const held = { target, size, base: selectionMask(target), scratch: new Uint8Array(size.width * size.height), last: at, erase: tool === 'eraser' };
      press.current = held;
      event.currentTarget.setPointerCapture(event.pointerId);
      step(held, at, true);
      return true;
    },
    move: (event) => {
      const held = press.current;
      if (!held) return false;
      step(held, pixelAtEvent(viewport.current, event), true);
      return true;
    },
    up: () => {
      const held = press.current;
      press.current = null;
      if (!held) return false;
      const { draft, setDraft } = useSelectionStore.getState();
      setDraft(null);
      commitSelection(held.target, draft);
      viewport.current?.redraw();
      return true;
    },
  };
};

export { useQuickMaskGesture };
