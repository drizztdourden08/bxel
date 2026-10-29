/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useToolStore } from '../stores/useToolStore';
import { allowPress } from './allow-press';
import { currentTarget } from './current-target';
import { insideSprite } from './inside-sprite';
import type { Gate } from './press-gate.type';
import { pressPlan } from './press-plan';
import type { PressEvent } from './press-plan.type';

const pressGate = (at: Point, press: PressEvent): Gate | null => {
  const target = currentTarget();
  const plan = pressPlan(useToolStore.getState().tool, press);
  if (!target || !plan || plan.kind === 'zoom') return null;
  return insideSprite(target, at) && allowPress(plan, target) ? { target, plan } : null;
};

export { pressGate };
