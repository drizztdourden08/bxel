/* @layer renderer-app @kind logic */
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { animationPng } from './animation-png';
import { animationUri } from './animation-uri';
import { drawnAnimation } from './animation-frames';
import { indexHash } from './index-hash';
import { reply } from './reply';
import type { AnimationSource } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const renderAnimation = async (context: ToolContext, view: DocumentView, documentId: string, source: AnimationSource, scale: number): Promise<ToolReply> => {
  const drawn = drawnAnimation(context, view.state.artwork, documentId, source);
  if (!drawn.ok) return reply(drawn);
  const png = animationPng(drawn.value.strip, scale);
  if (!png.ok) return reply(png);
  if (png.value.bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  const { revision } = view.state;
  return reply(
    {
      ok: true,
      revision,
      width: png.value.width,
      height: png.value.height,
      scale,
      indexHash: await indexHash(drawn.value.strip.indices),
      uri: animationUri(documentId, source, scale, revision),
    },
    [encodeBase64(png.value.bytes)],
  );
};

export { renderAnimation };
