/* @layer renderer-app @kind logic */
import type { ToolId } from '../tool.type';

const brushKeys = (tool: ToolId) => ({ size: `${tool}.size`, tip: `${tool}.tip`, perfect: `${tool}.pixel_perfect` });

export { brushKeys };
