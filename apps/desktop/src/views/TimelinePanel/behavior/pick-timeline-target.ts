/* @layer renderer-app @kind logic */
import { useToolStore } from '../../../stores/useToolStore';
import { goToCel } from '../../../timeline/go-to-cel';
import { goToFrame } from '../../../timeline/go-to-frame';
import { selectTag } from '../../../timeline/select-tag';
import type { EffectiveSelection } from '../../../timeline/timeline.type';
import type { TimelineClicked } from './timeline-clicked.type';

const pickCel = ({ layer, frame }: TimelineClicked, picked: EffectiveSelection): void => {
  if (!layer || !frame) return;
  const inside = picked.frames.includes(frame.id) && picked.layers.includes(layer.id);
  if (!inside) goToCel({ layerId: layer.id, frameId: frame.id });
};

const pickHead = ({ frame }: TimelineClicked, picked: EffectiveSelection): void => {
  if (frame && !picked.frames.includes(frame.id)) goToFrame(frame.id);
};

const pickTimelineTarget = (clicked: TimelineClicked, picked: EffectiveSelection): void => {
  if (clicked.kind === 'tag' && clicked.tag) selectTag(clicked.tag.id);
  else if (clicked.kind === 'cel') pickCel(clicked, picked);
  else if (clicked.kind === 'head') pickHead(clicked, picked);
  else if (clicked.kind === 'label' && clicked.layer) useToolStore.getState().setLayer(clicked.layer.id);
};

export { pickTimelineTarget };
