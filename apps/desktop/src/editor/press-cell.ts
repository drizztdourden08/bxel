/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { ANNOUNCE_TEXT } from '../announce/announce.constants';
import { useToolStore } from '../stores/useToolStore';
import { allowPress } from './allow-press';
import { commitSession } from './commit-session';
import { currentTarget } from './current-target';
import { insideSprite } from './inside-sprite';
import { pressPlan } from './press-plan';
import type { PressEvent } from './press-plan.type';
import { pressShape } from './press-shape';
import { runInstant } from './run-instant';
import { slotName } from './slot-name';
import { startSession } from './start-session';
import type { ShapeAnchor } from './shape-anchor.type';

const pressCell = (at: Point, press: PressEvent, anchor: ShapeAnchor): string => {
  const target = currentTarget();
  const plan = pressPlan(useToolStore.getState().tool, press);
  if (!target || !plan || plan.kind === 'zoom' || !insideSprite(target, at) || !allowPress(plan, target)) return ANNOUNCE_TEXT.blocked;
  if (plan.kind === 'pick') {
    runInstant('pick', target, at, plan.slot);
    return ANNOUNCE_TEXT.picked(slotName(target, useToolStore.getState()[plan.slot]));
  }
  if (plan.kind === 'fill') {
    runInstant('fill', target, at, plan.slot);
    return ANNOUNCE_TEXT.filled(at.x, at.y);
  }
  if (plan.kind === 'shape') return pressShape({ target, plan, at, constrain: press.shiftKey, anchor });
  commitSession(startSession(plan, target, at));
  return ANNOUNCE_TEXT.painted(at.x, at.y);
};

export { pressCell };
