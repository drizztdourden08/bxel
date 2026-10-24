/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import type { TimelineSelection } from '../stores/timeline-store.type';
import { celState } from './cel-state';
import { celUseCounts } from './cel-use-counts';
import { CEL_STATE_TEXT, TIMELINE_TEXT } from './timeline.constants';
import type { LayerRow } from './timeline.type';

const layerRows = (target: EditorTarget, selection: TimelineSelection): LayerRow[] => {
  const { sprite } = target;
  const counts = celUseCounts(sprite);
  const wholeFrames = selection.layers.length === 0;
  return sprite.layers
    .map((layer): LayerRow => {
      const layerSelected = wholeFrames || selection.layers.includes(layer.id);
      return {
        id: layer.id,
        name: layer.name,
        visible: layer.visible,
        locked: layer.locked,
        active: layer.id === target.layerId,
        cells: sprite.frames.map((frame, index) => {
          const state = celState(layer, frame.id, counts);
          return {
            layerId: layer.id,
            frameId: frame.id,
            state,
            current: layer.id === target.layerId && frame.id === target.frameId,
            selected: layerSelected && selection.frames.includes(frame.id),
            label: TIMELINE_TEXT.celLabel(layer.name, index + 1, CEL_STATE_TEXT[state]),
          };
        }),
      };
    })
    .reverse();
};

export { layerRows };
