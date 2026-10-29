/* @layer core @kind logic */
import type { ToolName } from '../tools/tool.type';
import type { ToolRowId } from './catalogue.type';
import { scopeOf } from './scope-of';
import { SETTING_ROWS } from './setting-rows.constants';

const rowOf = (tool: ToolName, input?: unknown): ToolRowId => {
  if (tool !== 'set_setting') return tool;
  return SETTING_ROWS[scopeOf(input) ?? 'app'];
};

export { rowOf };
