/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { animationPng } from './animation-png';
import { hiddenAssets } from './hidden-assets';
import { layersQuery } from './layers-query';
import { pngReply } from './png-reply';
import { reply } from './reply';
import { tilemapImage } from './tilemap-image';
import type { RenderInput, TilemapSource } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const renderTilemapPreview = (context: ToolContext, view: DocumentView, input: RenderInput, source: TilemapSource): Promise<ToolReply> => {
  const { documentId, scale } = input;
  const { revision, artwork } = view.state;
  const map = hiddenAssets(context, documentId).has(source.tilemapId) ? undefined : artwork.tilemaps.find((each) => each.id === source.tilemapId);
  if (!map) return Promise.resolve(reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noTilemapFound, { path: 'target.tilemapId' })));
  const layerIds = source.layerId === undefined && input.layers === undefined ? undefined : [...(source.layerId === undefined ? [] : [source.layerId]), ...(input.layers ?? [])];
  const missing = layerIds?.some((id) => !map.layers.some((layer) => layer.id === id));
  if (missing) {
    return Promise.resolve(reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noMapLayerFound, { path: source.layerId === undefined ? 'layers' : 'target.layerId' })));
  }
  const image = tilemapImage(artwork, { tilemapId: source.tilemapId, layerIds });
  if (image === null) return Promise.resolve(reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noTilemapFound, { path: 'target.tilemapId' })));
  const png = animationPng({ image, indices: new Uint8Array(0) }, scale);
  const layer = source.layerId === undefined ? '' : `/layer/${source.layerId}`;
  return pngReply(png, { revision, scale, uri: `bxel://${documentId}/tilemap/${source.tilemapId}${layer}/preview.png?scale=${scale}&rev=${revision}${layersQuery(input.layers)}` });
};

export { renderTilemapPreview };
