/* @layer renderer-app @kind logic */
import type { LayerRowModel } from '../LayerStack.type';

const rowMarks = (row: LayerRowModel, active: boolean, picked: boolean): Readonly<Record<`data-${string}`, string | number | undefined>> => ({
  'data-active': active ? 'yes' : undefined,
  'data-picked': picked ? 'yes' : undefined,
  'data-hidden': row.visible || row.mixedVisible ? undefined : 'yes',
  'data-tagged': row.colour ? 'yes' : undefined,
  'data-kind': row.kind,
  'data-depth': row.depth,
  'data-missing': row.missing ? 'yes' : undefined,
});

export { rowMarks };
