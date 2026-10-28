/* @layer renderer-app @kind logic */
import type { LayoutOp } from './layout-op.type';
import { LAYOUT_RUNNERS } from './layout-runners.constants';
import { layoutTarget } from './layout-target';

const run = (op: LayoutOp): void => {
  const runner = LAYOUT_RUNNERS[op.op] as (given: LayoutOp) => void;
  runner(op);
};

const runLayoutOp = (op: LayoutOp): string | null => {
  const unknown = layoutTarget(op);
  if (unknown !== null) return unknown;
  try {
    run(op);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
};

export { runLayoutOp };
