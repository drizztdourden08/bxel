/* @layer core @kind logic */
import { EDIT_FLAG_TOOLS, TOOL_MODE } from './tool-name.constants';
import type { ToolName } from './tool.type';

const toolNeedsEdit = (name: ToolName, input: unknown): boolean => {
  if (TOOL_MODE[name] === 'edit') return true;
  const flag = EDIT_FLAG_TOOLS[name];
  if (!flag || typeof input !== 'object' || input === null) return false;
  return Reflect.get(input, flag.field) === flag.value;
};

export { toolNeedsEdit };
