/* @layer renderer-app @kind logic */
import type { ToolId } from '../tool.type';
import { ALT_PICK_TOOLS, SPRING_KEYS } from './spring-keys.constants';

const springKeyTool = (key: string, current: ToolId): ToolId | null => {
  const tool = SPRING_KEYS[key];
  if (tool === undefined || tool === current) return null;
  if (key === 'Alt' && !ALT_PICK_TOOLS.includes(current)) return null;
  return tool;
};

export { springKeyTool };
