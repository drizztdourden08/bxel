/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { applyMark } from '../../../tilemap/terrain/apply-mark';
import { MARK_ATTR } from '../TilesetPanel.constants';

const markAt = (x: number, y: number): { key: number; bit: number } | null => {
  const found = document.elementFromPoint(x, y)?.closest<HTMLElement>(`[${MARK_ATTR.bit}]`);
  if (!found) return null;
  return { key: Number(found.getAttribute(MARK_ATTR.key)), bit: Number(found.getAttribute(MARK_ATTR.bit)) };
};

const markDrag = (event: PointerEvent<HTMLElement>, key: number, bit: number, on: boolean): void => {
  event.stopPropagation();
  applyMark(key, bit, on);
  let last = `${key}:${bit}`;
  const move = (next: globalThis.PointerEvent): void => {
    const hit = markAt(next.clientX, next.clientY);
    if (!hit || `${hit.key}:${hit.bit}` === last) return;
    last = `${hit.key}:${hit.bit}`;
    applyMark(hit.key, hit.bit, on);
  };
  const end = (): void => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', end);
    window.removeEventListener('pointercancel', end);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
};

export { markDrag };
