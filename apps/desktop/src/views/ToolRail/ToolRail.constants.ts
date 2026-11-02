/* @layer renderer-app @kind constants */
const TOOL_RAIL_TEXT = {
  region: 'Tools',
  zone: 'bxel.tool-rail',
  menuLabel: 'Tool menu',
  filledBadge: 'Filled',
  globalBadge: 'Global fill',
  tiledBadge: (tiled: string): string => (tiled === 'both' ? 'Tiled drawing on both axes' : `Tiled drawing on the ${tiled} axis`),
  modeBadge: (mode: string): string => `Selection mode ${mode}`,
} as const;

const RAIL_PRIORITY: Readonly<Record<string, number>> = {
  pencil: 100, eraser: 95, fill: 90, picker: 85, select: 80, line: 75, rect: 70, zoom: 65, hand: 60, move: 55, spray: 50, shade: 45, gradient: 40, ellipse: 35,
  curve: 30, polygon: 25, contour: 20,
};

const TILE_MODE_PRIORITY = 1000;

const MODE_BADGES = { add: '+', subtract: '-', intersect: 'x' } as const;

export { MODE_BADGES, RAIL_PRIORITY, TILE_MODE_PRIORITY, TOOL_RAIL_TEXT };
