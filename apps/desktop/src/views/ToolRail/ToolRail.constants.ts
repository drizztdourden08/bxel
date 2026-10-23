/* @layer renderer-app @kind constants */
const TOOL_RAIL_TEXT = {
  region: 'Tools',
  name: (label: string, key: string): string => `${label} (${key.toUpperCase()})`,
} as const;

export { TOOL_RAIL_TEXT };
