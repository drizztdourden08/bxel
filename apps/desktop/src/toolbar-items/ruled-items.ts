/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import type { BxelContext } from '../ui-context/bxel-context.type';
import { evaluate } from '../ui-context/evaluate';

const ruleIdOf = (item: ToolbarItem): string => `item.${item.id}`;

const ruledItems = (items: readonly ToolbarItem[], context: BxelContext, idOf: (item: ToolbarItem) => string = ruleIdOf): ToolbarItem[] =>
  items.flatMap((item): ToolbarItem[] => {
    if (item.kind === 'separator') return [item];
    const ui = evaluate(idOf(item), context);
    if (ui.state === 'hidden') return [];
    if (ui.state === 'shown') return [item];
    return [{ ...item, disabled: true, ...(ui.reason === null ? {} : { description: ui.reason }) }];
  });

export { ruledItems };
