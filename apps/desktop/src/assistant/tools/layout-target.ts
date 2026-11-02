/* @layer renderer-app @kind logic */
import { toolbars, widgets } from '@drizztdourden08/brock-react';
import { memberById } from '../../editor/tool-catalogue/member-by-id';
import type { LayoutOp } from './layout-op.type';

const unknownIn = (kind: string, id: string, known: readonly string[]): string => `Unknown ${kind} "${id}". Known ${kind}s: ${known.join(', ') || 'none'}.`;

const layoutTarget = (op: LayoutOp): string | null => {
  if ('widget' in op) {
    const known = widgets.list().map((each) => each.id);
    return known.includes(op.widget) ? null : unknownIn('widget', op.widget, known);
  }
  if ('toolbar' in op) {
    const known = toolbars.list().map((each) => each.id);
    return known.includes(op.toolbar) ? null : unknownIn('toolbar', op.toolbar, known);
  }
  if ('member' in op && memberById(op.member) === undefined) return `Unknown tool member "${op.member}". Use an id from list_tools.`;
  return null;
};

export { layoutTarget };
