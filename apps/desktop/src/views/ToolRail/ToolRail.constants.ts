/* @layer renderer-app @kind constants */
const TOOL_RAIL_TEXT = {
  region: 'Tools',
  zone: 'bxel.tool-rail',
  menuLabel: 'Tool menu',
  filledBadge: 'Filled',
  globalBadge: 'Global fill',
  modeBadge: (mode: string): string => `Selection mode ${mode}`,
} as const;

const MODE_BADGES = { add: '+', subtract: '-', intersect: 'x' } as const;

const RAIL_OPEN_KEYS = { vertical: { right: 'ArrowRight', left: 'ArrowLeft' }, horizontal: 'ArrowDown' } as const;

export { MODE_BADGES, RAIL_OPEN_KEYS, TOOL_RAIL_TEXT };
