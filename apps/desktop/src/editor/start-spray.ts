/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';
import type { EditorTarget, SpraySession } from './editor.type';
import { inkOf } from './ink-of';
import type { DrawPlan } from './press-plan.type';
import { ruleOf } from './rule-of';
import { beginSpray } from './begin-spray';
import { symmetryOf } from './symmetry-of';
import { wrapOf } from './wrap-of';

const freshSeed = (locked: number | null): number => locked ?? Math.floor(Math.random() * 4294967296);

const spraySession = (plan: Extract<DrawPlan, { kind: 'spray' }>, target: EditorTarget, at: Point): SpraySession => {
  const tools = useToolStore.getState();
  const drawing = useDrawingStore.getState();
  const choice = inkOf(plan.slot, tools, drawing, at);
  const options = {
    size: drawing.spraySize,
    density: drawing.sprayDensity,
    symmetry: symmetryOf(tools, target.sprite, at),
    wrap: wrapOf(),
    ...(choice.ink ? { ink: choice.ink } : {}),
    rule: ruleOf(target, choice.ink),
  };
  return beginSpray({ target, index: choice.index, options, seed: freshSeed(drawing.spraySeed), at });
};

export { spraySession };
