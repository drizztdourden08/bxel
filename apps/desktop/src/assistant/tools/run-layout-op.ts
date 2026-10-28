/* @layer renderer-app @kind logic */
import type { WidgetSized } from '@drizztdourden08/brock-react';
import type { LayoutOp, LayoutRun } from './layout-op.type';
import { LAYOUT_RUNNERS } from './layout-runners.constants';
import { layoutTarget } from './layout-target';

const run = (op: LayoutOp): WidgetSized | null => {
  const runner = LAYOUT_RUNNERS[op.op] as (given: LayoutOp) => WidgetSized | undefined;
  return runner(op) ?? null;
};

const runLayoutOp = (op: LayoutOp): LayoutRun => {
  const unknown = layoutTarget(op);
  if (unknown !== null) return { problem: unknown, sized: null };
  try {
    return { problem: null, sized: run(op) };
  } catch (error) {
    return { problem: error instanceof Error ? error.message : String(error), sized: null };
  }
};

export { runLayoutOp };
