/* @layer renderer-app @kind logic */
import { encodePngIndexed } from '@bxel/formats';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { bankRgba } from '../../export/bank-rgba';
import { growIndices } from './grow-indices';
import type { IndexedPicture } from './indexed-png.type';
import type { FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const indexedPng = ({ indices, width, height, bank }: IndexedPicture, scale: number): McpResult<FramePng> => {
  if (width * scale > RENDER_SIDE_MAX || height * scale > RENDER_SIDE_MAX) {
    return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.tooLarge(RENDER_SIDE_MAX), { path: 'scale' });
  }
  const grown = { indices: growIndices(indices, width, height, scale), palette: bankRgba(bank), width: width * scale, height: height * scale };
  const encoded = encodePngIndexed(grown);
  if (!encoded.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, encoded.message);
  return { ok: true, value: { bytes: encoded.bytes, width: grown.width, height: grown.height } };
};

export { indexedPng };
