/* @layer renderer-app @kind logic */
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { indexHash } from './index-hash';
import { reply } from './reply';
import { sheetPng } from './sheet-png';
import type { RenderInput, SheetSource } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const renderSheetPreview = async (context: ToolContext, view: DocumentView, input: RenderInput, source: SheetSource): Promise<ToolReply> => {
  const { documentId, scale } = input;
  const { revision, artwork } = view.state;
  const png = sheetPng({ artwork, revision, sheetId: source.sheetId, scale, hidden: hiddenAssets(context, documentId) });
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
      uri: `bxel://${documentId}/sheet/${source.sheetId}/preview.png?scale=${scale}&rev=${revision}`,
    },
    [encodeBase64(png.value.bytes)],
  );
};

export { renderSheetPreview };
