/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { animationPng } from './animation-png';
import { tilesetImage } from './tileset-image';
import type { FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const tilesetPng = (artwork: Artwork, hidden: ReadonlySet<string>, request: { tilesetId: string; overlay: 'none' | 'collision'; scale: number }): McpResult<FramePng> => {
  const tileset = hidden.has(request.tilesetId) ? undefined : artwork.tilesets.find((each) => each.id === request.tilesetId);
  if (!tileset) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noTilesetFound);
  return animationPng({ image: tilesetImage(artwork, tileset, request.overlay), indices: new Uint8Array(0) }, request.scale);
};

export { tilesetPng };
