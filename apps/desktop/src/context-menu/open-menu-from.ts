/* @layer renderer-app @kind logic */
import { openContextMenu } from '@drizztdourden08/brock-react';
import type { MenuHookEvent } from './open-menu-from.type';

const openMenuFrom = (zone: string, data: unknown, event: MenuHookEvent): void => {
  event.preventDefault();
  const origin = event.target instanceof Element ? event.target.getBoundingClientRect() : null;
  if (!('clientX' in event)) {
    openContextMenu(zone, data, { point: origin ? { x: origin.left, y: origin.bottom } : { x: 0, y: 0 }, trigger: 'keyboard' });
    return;
  }
  openContextMenu(zone, data, { point: { x: event.clientX, y: event.clientY }, trigger: 'pointer' });
};

export { openMenuFrom };
