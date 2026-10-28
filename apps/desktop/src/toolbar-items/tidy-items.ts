/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';

const tidyItems = (items: readonly ToolbarItem[]): ToolbarItem[] => {
  const result: ToolbarItem[] = [];
  for (const item of items) {
    if (item.kind === 'separator' && (result.length === 0 || result[result.length - 1]?.kind === 'separator')) continue;
    result.push(item);
  }
  if (result[result.length - 1]?.kind === 'separator') result.pop();
  return result;
};

export { tidyItems };
