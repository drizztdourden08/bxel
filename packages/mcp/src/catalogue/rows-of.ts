/* @layer core @kind logic */
import type { ToolName } from '../tools/tool.type';
import type { ToolRowId } from './catalogue.type';
import { rowOf } from './row-of';
import { scopeOf } from './scope-of';
import { SETTING_ROWS } from './setting-rows.constants';

const rowsOf = (tool: ToolName, input?: unknown): readonly ToolRowId[] =>
  tool === 'set_setting' && scopeOf(input) === null ? Object.values(SETTING_ROWS) : [rowOf(tool, input)];

export { rowsOf };
