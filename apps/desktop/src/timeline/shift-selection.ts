/* @layer renderer-app @kind logic */
import type { FrameId, LayerId } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import type { CelMove, EffectiveSelection, ShiftedSelection } from './timeline.type';

const shiftSelection = (target: EditorTarget, selection: EffectiveSelection, by: CelMove): ShiftedSelection => {
  const frames = target.sprite.frames.map((frame) => frame.id);
  const layers = target.sprite.layers.map((layer) => layer.id);
  const frameAt = (id: FrameId): FrameId => frames[frames.indexOf(id) + by.frames] ?? id;
  const layerAt = (id: LayerId): LayerId => layers[layers.indexOf(id) + by.layers] ?? id;
  const shiftedFrames = selection.frames.map(frameAt);
  const shiftedLayers = selection.layers.map(layerAt);
  const frameId = frameAt(target.frameId);
  const layerId = layerAt(target.layerId);
  return {
    selection: { frames: shiftedFrames, layers: shiftedLayers, anchor: { layerId, frameId } },
    frameId,
    layerId,
  };
};

export { shiftSelection };
