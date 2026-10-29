/* @layer renderer-app @kind logic */
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { PngReplyInput } from './png-reply.type';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';

const pngReply = async ({ png, render, hashOf, extra }: PngReplyInput): Promise<ToolReply> => {
  if (!png.ok) return reply(png);
  if (png.value.bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  return reply(
    {
      ok: true,
      revision: render.revision,
      width: png.value.width,
      height: png.value.height,
      scale: render.scale,
      indexHash: await hashOf(png.value),
      uri: render.uri,
      ...extra,
    },
    [encodeBase64(png.value.bytes)],
  );
};

export { pngReply };
