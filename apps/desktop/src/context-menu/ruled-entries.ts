/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import type { BxelContext } from '../ui-context/bxel-context.type';
import { currentContext } from '../ui-context/current-context';
import { evaluate } from '../ui-context/evaluate';

const ruledEntry = (entry: ContextMenuEntry, context: BxelContext): ContextMenuEntry => {
  if (entry === 'separator') return entry;
  if (typeof entry === 'string') return ruledEntry({ command: entry }, context);
  if ('items' in entry) return { ...entry, items: entry.items.map((each) => ruledEntry(each, context)) };
  if (!('command' in entry)) return entry;
  const ui = evaluate(entry.command, context);
  if (ui.state === 'shown') return entry;
  if (ui.state === 'hidden') return { ...entry, hidden: true };
  const reason = entry.reason ?? ui.reason;
  return { ...entry, disabled: true, ...(reason === null ? {} : { reason }) };
};

const ruledEntries =
  (build: (context: ContextMenuContext) => readonly ContextMenuEntry[]) =>
  (menu: ContextMenuContext): readonly ContextMenuEntry[] => {
    const context = currentContext();
    return build(menu).map((entry) => ruledEntry(entry, context));
  };

export { ruledEntries };
