/* @layer renderer-app @kind constants */
import type { ToolGroup } from '../../editor/tool.type';

const TOOL_RAIL_TEXT = {
  region: 'Tools',
  name: (label: string, key: string): string => `${label}  ${key.toUpperCase()}`,
  groups: {
    draw: 'Drawing tools',
    select: 'Selection tools',
    view: 'View tools',
  } satisfies Record<ToolGroup, string>,
  flyout: 'Shape options',
  selectFlyout: 'Selection options',
  selectShapes: 'Shape',
  selectModes: 'Mode',
  kinds: 'Shape',
  filled: 'Filled',
} as const;

export { TOOL_RAIL_TEXT };
