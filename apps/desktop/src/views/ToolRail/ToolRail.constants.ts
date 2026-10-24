/* @layer renderer-app @kind constants */
import type { ToolGroup } from '../../editor/tool.type';

const TOOL_RAIL_TEXT = {
  region: 'Tools',
  name: (label: string, key: string): string => `${label}  ${key.toUpperCase()}`,
  groups: {
    draw: 'Drawing tools',
    view: 'View tools',
  } satisfies Record<ToolGroup, string>,
  flyout: 'Shape options',
  kinds: 'Shape',
  filled: 'Filled',
} as const;

export { TOOL_RAIL_TEXT };
