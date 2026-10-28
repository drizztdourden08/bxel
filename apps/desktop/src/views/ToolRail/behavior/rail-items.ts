/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { TOOL_GROUPS } from '../../../editor/tools.constants';
import type { ToolDef } from '../../../editor/tool.type';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { evaluate } from '../../../ui-context/evaluate';
import type { RailItemContext } from '../ToolRail.type';

const railItem = (def: ToolDef, context: RailItemContext): ToolbarItem[] => {
  const ui = evaluate(COMMAND_ID.tool(def.id), context.context);
  if (ui.state === 'hidden') return [];
  const off = ui.state === 'disabled';
  return [
    {
      kind: 'toggle',
      id: def.id,
      label: def.label,
      description: off && ui.reason !== null ? ui.reason : def.description,
      shortcut: context.keys[def.id],
      icon: context.icons[def.id],
      options: off ? undefined : context.options[def.id],
      disabled: off,
      pressed: context.tool === def.id,
      onChange: () => context.pick(def.id),
    },
  ];
};

const railItems = (context: RailItemContext): ToolbarItem[] =>
  TOOL_GROUPS.map((group) => ({ group, items: context.defs.filter((def) => def.group === group).flatMap((def) => railItem(def, context)) }))
    .filter((entry) => entry.items.length > 0)
    .flatMap((entry, index): ToolbarItem[] => [...(index > 0 ? [{ kind: 'separator' as const, id: `before-${entry.group}` }] : []), ...entry.items]);

export { railItems };
