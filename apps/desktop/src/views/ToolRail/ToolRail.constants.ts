/* @layer renderer-app @kind constants */
import type { ToolGroup } from '../../editor/tool.type';

const TOOL_RAIL_TEXT = {
  region: 'Tools',
  groups: {
    draw: 'Drawing tools',
    select: 'Selection tools',
    view: 'View tools',
  } satisfies Record<ToolGroup, string>,
  selectShapes: 'Shape',
  selectModes: 'Mode',
  kinds: 'Shape',
  filled: 'Filled',
  filledDescription: 'Fill the inside of rectangles and ellipses.',
} as const;

export { TOOL_RAIL_TEXT };
