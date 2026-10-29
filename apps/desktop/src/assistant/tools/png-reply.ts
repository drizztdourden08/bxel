/* @layer renderer-app @kind logic */
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { McpResult, ToolReply } from '@bxel/mcp';
import { indexHash } from './index-hash';
import { reply } from './reply';
import type { FramePng, PngMeta } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const pngReply = async (png: McpResult<FramePng>, meta: PngMeta): Promise<ToolReply> => {
  if (!png.ok) return reply(png);
  if (png.value.bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  const { width, height, bytes } = png.value;
  return reply({ ok: true, revision: meta.revision, width, height, scale: meta.scale, indexHash: await indexHash(bytes), uri: meta.uri }, [encodeBase64(bytes)]);
};

export { pngReply };
