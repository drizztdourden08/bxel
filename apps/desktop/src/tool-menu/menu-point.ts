/* @layer renderer-app @kind logic */
import { MENU_EDGE_PX, MENU_ROW_PX } from './menu-point.constants';
import type { MenuPoint } from './menu-point.type';

const menuPoint = (stop: HTMLElement, rows: number): MenuPoint => {
  const box = stop.getBoundingClientRect();
  const horizontal = stop.closest('[role="toolbar"]')?.getAttribute('aria-orientation') === 'horizontal';
  if (horizontal) return { x: box.left, y: box.top > window.innerHeight / 2 ? box.top : box.bottom };
  const height = Math.min(window.innerHeight - 2 * MENU_EDGE_PX, rows * MENU_ROW_PX);
  const top = Math.min(box.top, window.innerHeight - height - MENU_EDGE_PX);
  return { x: box.left < window.innerWidth / 2 ? box.right : box.left, y: Math.max(MENU_EDGE_PX, top) };
};

export { menuPoint };
