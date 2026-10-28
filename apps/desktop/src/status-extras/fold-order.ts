/* @layer renderer-app @kind logic */
import type { StatusBarEntry } from '@drizztdourden08/tessera';

const foldOrder = (items: readonly StatusBarEntry[]): string[] =>
  items
    .map((item, at) => ({ id: item.id, priority: item.priority ?? 0, at }))
    .filter((item) => item.priority > 0)
    .sort((left, right) => right.priority - left.priority || right.at - left.at)
    .map((item) => item.id);

export { foldOrder };
