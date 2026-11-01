/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { renderAnimation } from './render-animation';
import { renderSheetPreview } from './render-sheet-preview';
import { renderTilemapPreview } from './render-tilemap-preview';
import { renderTilesetPreview } from './render-tileset-preview';
import type { RenderInput } from './tool-input.type';

const renderByTarget = (context: ToolContext, view: DocumentView, request: RenderInput): Promise<ToolReply> | null => {
  const { target } = request;
  if ('animationId' in target) return renderAnimation(context, view, request, target);
  if ('sheetId' in target) return renderSheetPreview(context, view, request, target);
  if ('tilemapId' in target) return renderTilemapPreview(context, view, request, target);
  if ('tilesetId' in target) return renderTilesetPreview(context, view, request, target);
  return null;
};

export { renderByTarget };
