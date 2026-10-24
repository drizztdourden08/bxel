/* @layer renderer-app @kind logic */
import { MCP_SIDE } from './mcp.constants';
import type { DrawnSprite } from './mcp-rig.type';

const patchStep = (sprite: DrawnSprite, pixels: Uint8Array, rect = { x: 0, y: 0, width: MCP_SIDE, height: MCP_SIDE }) => ({
  name: 'pixels.patch',
  targets: { sprites: [sprite.spriteId], layers: { by: 'ids', ids: [sprite.layerId] }, frames: { by: 'ids', ids: [sprite.frameId] } },
  options: { rect, pixels: Buffer.from(pixels).toString('base64') },
});

export { patchStep };
