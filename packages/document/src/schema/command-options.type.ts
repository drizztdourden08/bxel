/* @layer core @kind types */
import type { z } from 'zod';
import type { celClearSchema } from './cel-clear-schema';
import type { celSlotSchema } from './cel-slot-schema';
import type { celTransferSchema } from './cel-transfer-schema';
import type { celUnlinkSchema } from './cel-unlink-schema';
import type { frameAddSchema } from './frame-add-schema';
import type { frameDeleteSchema } from './frame-delete-schema';
import type { frameDuplicateSchema } from './frame-duplicate-schema';
import type { frameRefSchema } from './frame-ref-schema';
import type { frameReorderSchema } from './frame-reorder-schema';
import type { frameUpdateSchema } from './frame-update-schema';
import type { tagAddSchema } from './tag-add-schema';
import type { tagDeleteSchema } from './tag-delete-schema';
import type { tagRefSchema } from './tag-ref-schema';
import type { tagUpdateSchema } from './tag-update-schema';
import type { layerAddSchema } from './layer-add-schema';
import type { layerDeleteSchema } from './layer-delete-schema';
import type { layerDuplicateSchema } from './layer-duplicate-schema';
import type { layerFlattenSchema } from './layer-flatten-schema';
import type { layerMergeSchema } from './layer-merge-schema';
import type { layerRefSchema } from './layer-ref-schema';
import type { layerReorderSchema } from './layer-reorder-schema';
import type { layerUpdateSchema } from './layer-update-schema';
import type { pixelsPatchSchema } from './pixels-patch-schema';
import type { artworkCreateSchema } from './artwork-create-schema';
import type { artworkUpdateSchema } from './artwork-update-schema';
import type { spriteCreateSchema } from './sprite-create-schema';
import type { spriteUpdateSchema } from './sprite-update-schema';
import type { mapEraseSchema } from './map-erase-schema';
import type { mapFillSchema } from './map-fill-schema';
import type { mapLayerAddSchema } from './map-layer-add-schema';
import type { mapLayerDeleteSchema } from './map-layer-delete-schema';
import type { mapLayerRefSchema } from './map-layer-ref-schema';
import type { mapLayerReorderSchema } from './map-layer-reorder-schema';
import type { mapLayerUpdateSchema } from './map-layer-update-schema';
import type { mapPaintSchema } from './map-paint-schema';
import type { mapRectSchema } from './map-rect-schema';
import type { mapReplaceSchema } from './map-replace-schema';
import type { tileAddSchema } from './tile-add-schema';
import type { tileDeleteSchema } from './tile-delete-schema';
import type { tileRefSchema } from './tile-ref-schema';
import type { tileUniqueSchema } from './tile-unique-schema';
import type { tilemapCreateSchema } from './tilemap-create-schema';
import type { tilemapDeleteSchema } from './tilemap-delete-schema';
import type { tilemapResizeSchema } from './tilemap-resize-schema';
import type { tilemapUpdateSchema } from './tilemap-update-schema';
import type { tilesetCreateSchema } from './tileset-create-schema';
import type { tilesetDeleteSchema } from './tileset-delete-schema';
import type { tilesetUpdateSchema } from './tileset-update-schema';

type ArtworkCreateOptions = z.output<typeof artworkCreateSchema>;
type ArtworkUpdateOptions = z.output<typeof artworkUpdateSchema>;
type SpriteCreateOptions = z.output<typeof spriteCreateSchema>;
type SpriteUpdateOptions = z.output<typeof spriteUpdateSchema>;
type PixelsPatchOptions = z.output<typeof pixelsPatchSchema>;
type LayerRef = z.output<typeof layerRefSchema>;
type LayerAddOptions = z.output<typeof layerAddSchema>;
type LayerUpdateOptions = z.output<typeof layerUpdateSchema>;
type LayerDeleteOptions = z.output<typeof layerDeleteSchema>;
type LayerReorderOptions = z.output<typeof layerReorderSchema>;
type LayerDuplicateOptions = z.output<typeof layerDuplicateSchema>;
type LayerMergeOptions = z.output<typeof layerMergeSchema>;
type LayerFlattenOptions = z.output<typeof layerFlattenSchema>;
type CelClearOptions = z.output<typeof celClearSchema>;
type CelSlotRef = z.output<typeof celSlotSchema>;
type CelTransferOptions = z.output<typeof celTransferSchema>;
type CelUnlinkOptions = z.output<typeof celUnlinkSchema>;
type FrameAddOptions = z.output<typeof frameAddSchema>;
type FrameDeleteOptions = z.output<typeof frameDeleteSchema>;
type FrameDuplicateOptions = z.output<typeof frameDuplicateSchema>;
type FrameRef = z.output<typeof frameRefSchema>;
type FrameReorderOptions = z.output<typeof frameReorderSchema>;
type FrameUpdateOptions = z.output<typeof frameUpdateSchema>;
type TagAddOptions = z.output<typeof tagAddSchema>;
type TagDeleteOptions = z.output<typeof tagDeleteSchema>;
type TagRef = z.output<typeof tagRefSchema>;
type TagUpdateOptions = z.output<typeof tagUpdateSchema>;
type TilesetCreateOptions = z.output<typeof tilesetCreateSchema>;
type TilesetUpdateOptions = z.output<typeof tilesetUpdateSchema>;
type TilesetDeleteOptions = z.output<typeof tilesetDeleteSchema>;
type TileAddOptions = z.output<typeof tileAddSchema>;
type TileDeleteOptions = z.output<typeof tileDeleteSchema>;
type TileUniqueOptions = z.output<typeof tileUniqueSchema>;
type TileRef = z.output<typeof tileRefSchema>;
type TilemapCreateOptions = z.output<typeof tilemapCreateSchema>;
type TilemapUpdateOptions = z.output<typeof tilemapUpdateSchema>;
type TilemapResizeOptions = z.output<typeof tilemapResizeSchema>;
type TilemapDeleteOptions = z.output<typeof tilemapDeleteSchema>;
type MapLayerRef = z.output<typeof mapLayerRefSchema>;
type MapLayerAddOptions = z.output<typeof mapLayerAddSchema>;
type MapLayerUpdateOptions = z.output<typeof mapLayerUpdateSchema>;
type MapLayerDeleteOptions = z.output<typeof mapLayerDeleteSchema>;
type MapLayerReorderOptions = z.output<typeof mapLayerReorderSchema>;
type MapPaintOptions = z.output<typeof mapPaintSchema>;
type MapEraseOptions = z.output<typeof mapEraseSchema>;
type MapFillOptions = z.output<typeof mapFillSchema>;
type MapRectOptions = z.output<typeof mapRectSchema>;
type MapReplaceOptions = z.output<typeof mapReplaceSchema>;

export type {
  MapEraseOptions,
  MapFillOptions,
  MapLayerAddOptions,
  MapLayerDeleteOptions,
  MapLayerRef,
  MapLayerReorderOptions,
  MapLayerUpdateOptions,
  MapPaintOptions,
  MapRectOptions,
  MapReplaceOptions,
  TileAddOptions,
  TileDeleteOptions,
  TileRef,
  TileUniqueOptions,
  TilemapCreateOptions,
  TilemapDeleteOptions,
  TilemapResizeOptions,
  TilemapUpdateOptions,
  TilesetCreateOptions,
  TilesetDeleteOptions,
  TilesetUpdateOptions,
  CelClearOptions,
  CelSlotRef,
  CelTransferOptions,
  CelUnlinkOptions,
  FrameAddOptions,
  FrameDeleteOptions,
  FrameDuplicateOptions,
  FrameRef,
  FrameReorderOptions,
  FrameUpdateOptions,
  TagAddOptions,
  TagDeleteOptions,
  TagRef,
  TagUpdateOptions,
  LayerAddOptions,
  LayerDeleteOptions,
  LayerDuplicateOptions,
  LayerFlattenOptions,
  LayerMergeOptions,
  LayerRef,
  LayerReorderOptions,
  LayerUpdateOptions,
  PixelsPatchOptions,
  ArtworkCreateOptions,
  ArtworkUpdateOptions,
  SpriteCreateOptions,
  SpriteUpdateOptions,
};
