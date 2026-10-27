/* @layer renderer-app @kind logic */
import type { Level, ToolKind } from '@bxel/mcp';

const shownLevel = (level: Level, kind: ToolKind): Level => (kind === 'read' && level === 'edit' ? 'read' : level);

export { shownLevel };
