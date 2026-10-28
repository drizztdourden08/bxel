/* @layer renderer-app @kind logic */
import { liveSpriteLayerImage, mapLayerImage, spriteLayerImage } from '../../../editor/layer-thumb-image';
import type { Overlay } from '../../../editor/editor.type';
import type { FrameImage } from '../../../sheet/sheet.type';
import type { LayerThumbSource } from '../LayerStack.type';

/** The image a layer thumbnail shows. Built when the thumbnail draws, not when the row renders. */
const layerThumbImageOf = (source: LayerThumbSource, live: Overlay | null): FrameImage => {
  if (source.kind === 'map') return mapLayerImage(source.layer, source.columns, source.rows);
  const { sprite, bank, layer, frameId } = source;
  const stroking = live !== null && live.width === sprite.width && live.height === sprite.height;
  return stroking ? liveSpriteLayerImage(sprite, bank, layer, frameId, live) : spriteLayerImage(sprite, bank, layer, frameId);
};

interface ThumbDeps {
  pixels: Uint8Array | Uint32Array | null | undefined;
  bank: object | null;
  width: number;
  height: number;
}

/** What makes a thumbnail draw again: the pixels of this one layer in this frame, the palette and the size. */
const layerThumbDeps = (source: LayerThumbSource): ThumbDeps => {
  if (source.kind === 'map') return { pixels: source.layer.cells, bank: null, width: source.columns, height: source.rows };
  const celId = source.layer.cels[source.frameId];
  return { pixels: celId === undefined ? null : source.sprite.cels[celId]?.pixels, bank: source.bank, width: source.sprite.width, height: source.sprite.height };
};

export { layerThumbDeps, layerThumbImageOf };
