/* @layer renderer-app @kind logic */
import type { StatusBarEntry } from '@drizztdourden08/tessera';
import { foldOrder } from './fold-order';

const foldItems = (items: readonly StatusBarEntry[], dropped: number): StatusBarEntry[] => {
  const gone = new Set(foldOrder(items).slice(0, dropped));
  return items.filter((item) => !gone.has(item.id)).map(({ priority: _kept, ...rest }) => rest);
};

export { foldItems };
