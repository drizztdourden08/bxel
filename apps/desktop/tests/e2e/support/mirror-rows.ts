/* @layer renderer-app @kind logic */
import { MCP_SIDE } from './mcp.constants';

const mirrorRows = (pixels: Uint8Array): Uint8Array =>
  Uint8Array.from(pixels, (_, at) => {
    const x = at % MCP_SIDE;
    const y = Math.floor(at / MCP_SIDE);
    return pixels[y * MCP_SIDE + (MCP_SIDE - 1 - x)] ?? 0;
  });

export { mirrorRows };
