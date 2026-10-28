/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { pngReply } from './png-reply';
import { tilesetPng } from './tileset-png';
import type { RenderInput, TilesetSource } from './tool-input.type';

const renderTilesetPreview = (context: ToolContext, view: DocumentView, input: RenderInput, source: TilesetSource): Promise<ToolReply> => {
  const { documentId, scale } = input;
  const { revision, artwork } = view.state;
  const overlay = source.overlay ?? 'none';
  const png = tilesetPng(artwork, hiddenAssets(context, documentId), { tilesetId: source.tilesetId, overlay, scale });
  const uri = `bxel://${documentId}/tileset/${source.tilesetId}/preview.png?scale=${scale}&overlay=${overlay}&rev=${revision}`;
  return pngReply(png, { revision, scale, uri });
};

export { renderTilesetPreview };
