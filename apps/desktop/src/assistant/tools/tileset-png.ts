/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { encodePngRgba, upscaleRgba } from '@bxel/formats';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { tilesetImage } from './tileset-image';
import type { FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const tilesetPng = (artwork: Artwork, hidden: ReadonlySet<string>, request: { tilesetId: string; overlay: 'none' | 'collision'; scale: number }): McpResult<FramePng> => {
  const tileset = hidden.has(request.tilesetId) ? undefined : artwork.tilesets.find((each) => each.id === request.tilesetId);
  if (!tileset) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noTilesetFound);
  const image = tilesetImage(artwork, tileset, request.overlay);
  if (image.width * request.scale > RENDER_SIDE_MAX || image.height * request.scale > RENDER_SIDE_MAX) {
    return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.tooLarge(RENDER_SIDE_MAX), { path: 'scale' });
  }
  const scaled = upscaleRgba(image, request.scale);
  const encoded = encodePngRgba(scaled);
  if (!encoded.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, encoded.message);
  return { ok: true, value: { bytes: encoded.bytes, width: scaled.width, height: scaled.height } };
};

export { tilesetPng };
