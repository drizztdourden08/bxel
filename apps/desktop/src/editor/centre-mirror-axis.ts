/* @layer renderer-app @kind logic */
import type { AxisArgs } from '../context-menu/menu-args.type';
import { useToolStore } from '../stores/useToolStore';

const centreMirrorAxis = (args: Partial<AxisArgs>): void => {
  const axes = args.axis === undefined ? (['x', 'y'] as const) : [args.axis];
  for (const axis of axes) useToolStore.getState().setAxis(axis, null);
};

export { centreMirrorAxis };
