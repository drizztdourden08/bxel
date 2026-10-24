/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { TOOL_GROUPS } from '../../../editor/tools.constants';
import type { ToolDef } from '../../../editor/tool.type';
import type { RailItemContext } from '../ToolRail.type';

const railItem = (def: ToolDef, context: RailItemContext): ToolbarItem => ({
  kind: 'toggle',
  id: def.id,
  label: def.label,
  description: def.description,
  shortcut: context.keys[def.id],
  icon: context.icons[def.id],
  options: context.options[def.id],
  pressed: context.tool === def.id,
  onChange: () => context.pick(def.id),
});

const railItems = (context: RailItemContext): ToolbarItem[] =>
  TOOL_GROUPS.flatMap((group, index): ToolbarItem[] => [
    ...(index > 0 ? [{ kind: 'separator' as const, id: `after-${TOOL_GROUPS[index - 1]}` }] : []),
    ...context.defs.filter((def) => def.group === group).map((def) => railItem(def, context)),
  ]);

export { railItems };
