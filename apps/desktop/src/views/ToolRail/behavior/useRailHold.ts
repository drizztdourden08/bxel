/* @layer renderer-app @kind hook */
import { openContextMenu } from '@drizztdourden08/brock-react';
import type { ToolbarSlot } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { currentSurface } from '../../../surface/current-surface';
import { RAIL_OPEN_KEYS, TOOL_RAIL_TEXT } from '../ToolRail.constants';
import { DRAG_LIMIT } from './useRailHold.constants';
import { flyoutModel } from '../../../tool-menu/flyout-model';
import { flyoutRows } from '../../../tool-menu/flyout-rows';
import { menuPoint } from '../../../tool-menu/menu-point';
import { stopOf } from '../../../tool-menu/stop-of';

const hasFlyout = (id: string | null): boolean => {
  const surface = currentSurface();
  const slot = slotsOf(surface).find((each) => each.id === id);
  return slot !== undefined && flyoutModel(slot, surface).hasContent;
};

const openKeyOf = (slot: ToolbarSlot): string => {
  if (slot.orientation === 'horizontal') return RAIL_OPEN_KEYS.horizontal;
  return slot.menuSide === 'left' ? RAIL_OPEN_KEYS.vertical.left : RAIL_OPEN_KEYS.vertical.right;
};

const useRailHold = (slot: ToolbarSlot) => {
  const timer = useRef<number | undefined>(undefined);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);
  const cancel = (): void => {
    window.clearTimeout(timer.current);
    origin.current = null;
  };
  const open = (stop: HTMLElement, trigger: 'pointer' | 'longpress' | 'keyboard'): void => {
    const id = stop.getAttribute('data-toolbar-stop');
    openContextMenu(TOOL_RAIL_TEXT.zone, id, { point: menuPoint(stop, flyoutRows(id)), trigger });
  };
  const onContextMenu = (event: MouseEvent<HTMLElement>): void => {
    const stop = stopOf(event.target);
    if (stop === null || !hasFlyout(stop.getAttribute('data-toolbar-stop'))) return;
    event.preventDefault();
    open(stop, 'pointer');
  };
  const onPointerDown = (event: PointerEvent<HTMLElement>): void => {
    const stop = stopOf(event.target);
    fired.current = false;
    if (event.button !== 0 || stop === null || !hasFlyout(stop.getAttribute('data-toolbar-stop'))) return;
    origin.current = { x: event.clientX, y: event.clientY };
    timer.current = window.setTimeout(() => {
      fired.current = true;
      open(stop, 'longpress');
    }, useToolPrefsStore.getState().holdMs);
  };
  const onPointerMove = (event: PointerEvent<HTMLElement>): void => {
    const from = origin.current;
    if (from !== null && Math.hypot(event.clientX - from.x, event.clientY - from.y) > DRAG_LIMIT) cancel();
  };
  const onClickCapture = (event: MouseEvent<HTMLElement>): void => {
    if (!fired.current) return;
    fired.current = false;
    event.preventDefault();
    event.stopPropagation();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    const stop = stopOf(event.target);
    if (stop === null || event.key !== openKeyOf(slot) || !hasFlyout(stop.getAttribute('data-toolbar-stop'))) return;
    event.preventDefault();
    open(stop, 'keyboard');
  };
  return { onPointerDown, onPointerMove, onPointerUp: cancel, onPointerCancel: cancel, onPointerLeave: cancel, onClickCapture, onContextMenu, onKeyDown };
};

export { useRailHold };
