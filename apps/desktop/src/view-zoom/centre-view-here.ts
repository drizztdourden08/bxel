/* @layer renderer-app @kind logic */
import type { PixelArgs } from '../context-menu/menu-args.type';
import { useViewStore } from '../stores/useViewStore';

const centreViewHere = (args: Partial<PixelArgs>): void => {
  const { viewport } = useViewStore.getState();
  if (!viewport || args.x === undefined || args.y === undefined) return;
  viewport.panTo({ x: args.x + 0.5, y: args.y + 0.5 });
};

export { centreViewHere };
