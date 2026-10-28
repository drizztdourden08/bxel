/* @layer renderer-app @kind logic */
import { tickSpray } from '../../../editor/tick-spray';
import { SPRAY_TICK_MS } from '../../../stores/drawing-store.constants';
import { gestureLive } from './gesture-live';

const startSprayTimer = (): void => {
  gestureLive.timer = window.setInterval(() => {
    const active = gestureLive.session;
    if (active?.kind !== 'spray') return;
    tickSpray(active);
    gestureLive.redraw();
  }, SPRAY_TICK_MS);
};

export { startSprayTimer };
