/* @layer renderer-app @kind logic */
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { indexHash } from './index-hash';
import { reply } from './reply';
import type { RenderInput, TilesetSource } from './tool-input.type';
import { tilesetPng } from './tileset-png';
import { TOOL_TEXT } from './tools.constants';

const renderTilesetPreview = async (context: ToolContext, view: DocumentView, input: RenderInput, source: TilesetSource): Promise<ToolReply> => {
  const { documentId, scale } = input;
  const { revision, artwork } = view.state;
  const overlay = source.overlay ?? 'none';
  const png = tilesetPng(artwork, hiddenAssets(context, documentId), { tilesetId: source.tilesetId, overlay, scale });
  if (!png.ok) return reply(png);
  if (png.value.bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  return reply(
    {
      ok: true,
      revision,
      width: png.value.width,
      height: png.value.height,
      scale,
      indexHash: await indexHash(png.value.bytes),
      uri: `bxel://${documentId}/tileset/${source.tilesetId}/preview.png?scale=${scale}&overlay=${overlay}&rev=${revision}`,
    },
    [encodeBase64(png.value.bytes)],
  );
};

export { renderTilesetPreview };
