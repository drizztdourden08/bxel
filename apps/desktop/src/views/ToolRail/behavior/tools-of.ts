/* @layer renderer-app @kind logic */
import type { ToolDef } from '../../../editor/tool.type';
import type { Surface } from '../../../surface/surface.type';

const toolsOf = (surface: Surface, defs: readonly ToolDef[]): readonly ToolDef[] =>
  surface === 'sheet' ? defs.filter((def) => def.group === 'view') : defs;

export { toolsOf };
