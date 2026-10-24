/* @layer core @kind logic */
import type { SpriteId } from '../../model/ids.type';
import type { Layer } from '../../model/sprite.type';
import type { TargetIssue } from '../command-error.type';

const layerIssue = (spriteId: SpriteId, layer: Layer, reason: string): TargetIssue => ({
  spriteId,
  layerId: layer.id,
  frameId: null,
  reason,
});

export { layerIssue };
