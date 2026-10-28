/* @layer renderer-app @kind logic */
import { liveSpriteLayerImage } from '../../../editor/live-sprite-layer-image';
import { mapLayerImage } from '../../../editor/map-layer-image';
import { spriteLayerImage } from '../../../editor/sprite-layer-image';
import type { Overlay } from '../../../editor/editor.type';
import type { FrameImage } from '../../../sheet/sheet.type';
import type { LayerThumbSource } from '../LayerStack.type';

const layerThumbImageOf = (source: LayerThumbSource, live: Overlay | null): FrameImage => {
  if (source.kind === 'map') return mapLayerImage(source.layer, source.columns, source.rows);
  const stroking = live !== null && live.width === source.sprite.width && live.height === source.sprite.height;
  return stroking ? liveSpriteLayerImage(source, live) : spriteLayerImage(source);
};

export { layerThumbImageOf };
