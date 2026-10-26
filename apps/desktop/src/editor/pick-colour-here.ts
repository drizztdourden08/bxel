/* @layer renderer-app @kind logic */
import type { PickHereArgs } from '../context-menu/menu-args.type';
import { currentTarget } from './current-target';
import { HELD_SLOTS } from './held-colours.constants';
import { insideSprite } from './inside-sprite';
import { runInstant } from './run-instant';

const pickColourHere = (args: Partial<PickHereArgs>): void => {
  const target = currentTarget();
  const slot = args.slot === undefined ? undefined : HELD_SLOTS[args.slot - 1];
  const at = args.x === undefined || args.y === undefined ? null : { x: args.x, y: args.y };
  if (target && slot && at && insideSprite(target, at)) runInstant('pick', target, at, slot);
};

export { pickColourHere };
