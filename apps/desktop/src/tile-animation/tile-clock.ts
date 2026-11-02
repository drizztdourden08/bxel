/* @layer renderer-app @kind logic */
import { useTileClockStore } from '../stores/useTileClockStore';
import type { ClockListener } from './tile-clock.type';

const listeners = new Set<ClockListener>();
let frame = 0;
let last = 0;
let virtual = 0;

const tick = (now: number): void => {
  const { paused, speed } = useTileClockStore.getState();
  if (last > 0 && !paused) virtual += (now - last) * speed;
  last = now;
  for (const listener of listeners) listener(virtual);
  frame = listeners.size > 0 ? window.requestAnimationFrame(tick) : 0;
};

const subscribeTileClock = (listener: ClockListener): (() => void) => {
  listeners.add(listener);
  if (listeners.size === 1 && frame === 0) frame = window.requestAnimationFrame(tick);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && frame !== 0) {
      window.cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    }
  };
};

export { subscribeTileClock };
