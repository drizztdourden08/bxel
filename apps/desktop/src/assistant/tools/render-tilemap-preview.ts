/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { animationPng } from './animation-png';
import { hiddenAssets } from './hidden-assets';
import { layersQuery } from './layers-query';
import { missingLayerPath } from './missing-layer-path';
import { notFound } from './not-found';
import { pngReply } from './png-reply';
import { requestedLayers } from './requested-layers';
import { tilemapImage } from './tilemap-image';
import type { RenderInput, TilemapSource } from './tool-input.type';
import { TILEMAP_PATH, TOOL_TEXT } from './tools.constants';

const renderTilemapPreview = (context: ToolContext, view: DocumentView, input: RenderInput, source: TilemapSource): Promise<ToolReply> => {
  const { documentId, scale } = input;
  const { revision, artwork } = view.state;
  const map = hiddenAssets(context, documentId).has(source.tilemapId) ? undefined : artwork.tilemaps.find((each) => each.id === source.tilemapId);
  if (!map) return notFound(TOOL_TEXT.noTilemapFound, TILEMAP_PATH);
  const layerIds = requestedLayers(source, input);
  const missing = missingLayerPath(map.layers, source, layerIds);
  if (missing) return notFound(TOOL_TEXT.noMapLayerFound, missing);
  const image = tilemapImage(artwork, { tilemapId: source.tilemapId, layerIds });
  if (image === null) return notFound(TOOL_TEXT.noTilemapFound, TILEMAP_PATH);
  const png = animationPng({ image, indices: new Uint8Array(0) }, scale);
  const layer = source.layerId === undefined ? '' : `/layer/${source.layerId}`;
  return pngReply(png, { revision, scale, uri: `bxel://${documentId}/tilemap/${source.tilemapId}${layer}/preview.png?scale=${scale}&rev=${revision}${layersQuery(input.layers)}` });
};

export { renderTilemapPreview };
