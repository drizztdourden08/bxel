/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { RefObject } from 'react';
import type { Point } from '@bxel/raster';
import { currentTarget } from '../../../editor/current-target';
import { commitSelection } from '../../../editor/selection/commit-selection';
import { quickMaskResult } from '../../../editor/selection/quick-mask';
import { quickMaskFill } from '../../../editor/selection/quick-mask-fill';
import { stampQuickMask } from '../../../editor/selection/stamp-quick-mask';
import { stampQuickShape } from '../../../editor/selection/stamp-quick-shape';
import { selectionMask } from '../../../editor/selection/selection-mask';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '../../../editor/tools.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { SelectGesture } from './canvas-tools.type';
import { gestureMods } from './gesture-mods';
import { pixelAtEvent } from './pixel-at-event';
import { quickMaskCorners } from './quick-mask-corners';
import { MASK_SHAPES, MASK_TOOLS, NO_MODS } from './useQuickMaskGesture.constants';
import type { QuickMaskMods, QuickMaskPress } from './useQuickMaskGesture.type';

const maskButton = (button: number): boolean => button === PRIMARY_BUTTON || button === SECONDARY_BUTTON;

const useQuickMaskGesture = (viewport: RefObject<PixelViewportHandle | null>): SelectGesture => {
  const press = useRef<QuickMaskPress | null>(null);
  const step = (held: QuickMaskPress, to: Point, mods: QuickMaskMods): void => {
    const tools = useToolStore.getState();
    if (held.shape) {
      held.scratch.fill(0);
      stampQuickShape(held.scratch, held.size, { shape: held.shape, corners: quickMaskCorners(held.shape, held.anchor, to, mods) }, tools);
    } else {
      stampQuickMask(held.scratch, held.size, [held.last, to], tools);
    }
    held.last = to;
    useSelectionStore.getState().setDraft(quickMaskResult(held.base, held.scratch, held.size, held.erase));
    viewport.current?.redraw();
  };
  return {
    down: (event) => {
      const tool = useToolStore.getState().tool;
      const target = currentTarget();
      if (!useSelectionStore.getState().quickMask || !maskButton(event.button) || !MASK_TOOLS.includes(tool) || !target) return false;
      const size = { width: target.sprite.width, height: target.sprite.height };
      const at = pixelAtEvent(viewport.current, event);
      const base = selectionMask(target);
      const erase = tool === 'eraser' || event.button === SECONDARY_BUTTON;
      if (tool === 'fill') {
        commitSelection(target, quickMaskFill({ base, size, seed: at, erase, connectivity: useToolStore.getState().connectivity }));
        viewport.current?.redraw();
        return true;
      }
      const held = { target, size, base, scratch: new Uint8Array(size.width * size.height), anchor: at, last: at, erase, shape: MASK_SHAPES[tool] ?? null };
      press.current = held;
      event.currentTarget.setPointerCapture(event.pointerId);
      step(held, at, NO_MODS);
      return true;
    },
    move: (event) => {
      const held = press.current;
      if (!held) return false;
      const mods = gestureMods(event);
      step(held, pixelAtEvent(viewport.current, event), { constrain: mods.constrain, centre: mods.centre });
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
