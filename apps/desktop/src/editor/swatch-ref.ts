/* @layer renderer-app @kind logic */
import type { SwatchArgs } from '../context-menu/menu-args.type';
import { useToolStore } from '../stores/useToolStore';
import { HELD_SLOTS } from './held-colours.constants';

const swatchRef = (args: Partial<SwatchArgs>): number | null => {
  if (args.index !== undefined) return args.index;
  const slot = args.slot === undefined ? undefined : HELD_SLOTS[args.slot - 1];
  return slot === undefined ? null : useToolStore.getState()[slot];
};

export { swatchRef };
