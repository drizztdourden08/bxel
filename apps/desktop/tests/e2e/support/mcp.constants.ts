/* @layer renderer-app @kind constants */
const MCP_SIDE = 8;

const MCP_COLORS = ['#E0245E', '#4B1FA0', '#FFD166'] as const;

const MCP_ARTWORK = {
  name: 'Check',
  bank: { name: 'Main', cap: 16, transparent: true, colors: MCP_COLORS.map((rgb) => ({ rgb })) },
  sprite: { name: 'hero', width: MCP_SIDE, height: MCP_SIDE },
} as const;

const MCP_DRAWN = Uint8Array.from({ length: MCP_SIDE * MCP_SIDE }, (_, at) => {
  const x = at % MCP_SIDE;
  const y = Math.floor(at / MCP_SIDE);
  if (x > 3) return 0;
  return x === 0 || y === x ? 1 + ((x + y) % 3) : 0;
});

const MCP_TOOL_COUNT = 24;

const MCP_CLIENT_NAME = 'bxel-check7';

export { MCP_ARTWORK, MCP_CLIENT_NAME, MCP_COLORS, MCP_DRAWN, MCP_SIDE, MCP_TOOL_COUNT };
