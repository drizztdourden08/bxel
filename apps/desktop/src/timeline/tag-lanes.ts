/* @layer renderer-app @kind logic */
import type { AnimTag, Animation, TagId } from '@bxel/document';
import { spanTagOf } from './span-tag-of';
import { tagBarLabel } from './tag-bar-label';
import { TAG_COLOURS } from './timeline.constants';
import type { TagBar } from './timeline.type';

const barOf = (animation: Animation, tag: AnimTag, index: number, selectedId: TagId | null): TagBar | null => {
  const base = spanTagOf(animation, tag);
  if (!base) return null;
  const order = animation.frames.map((frame) => frame.id);
  const from = order.indexOf(base.from);
  const to = order.indexOf(base.to);
  if (from < 0 || to < 0) return null;
  const bar: Omit<TagBar, 'label'> = {
    tagId: tag.id,
    name: tag.kind === 'mirror' ? `${base.name} (${tag.facing})` : base.name,
    colour: TAG_COLOURS[index % TAG_COLOURS.length] ?? 'blue',
    custom: base.colour ?? null,
    start: Math.min(from, to),
    end: Math.max(from, to),
    direction: base.direction,
    repeat: base.repeat,
    facing: tag.kind === 'mirror' ? tag.facing : (base.facing ?? null),
    mirror: tag.kind === 'mirror',
    flip: tag.kind === 'mirror' ? tag.flip : null,
    selected: tag.id === selectedId,
  };
  return { ...bar, label: tagBarLabel(bar) };
};

const tagLanes = (animation: Animation, selectedId: TagId | null): TagBar[][] => {
  const bars = animation.tags.flatMap((tag, index) => barOf(animation, tag, index, selectedId) ?? []);
  const lanes: TagBar[][] = [];
  for (const bar of [...bars].sort((a, b) => a.start - b.start || b.end - a.end)) {
    const lane = lanes.find((each) => (each.at(-1)?.end ?? -1) < bar.start);
    if (lane) lane.push(bar);
    else lanes.push([bar]);
  }
  return lanes;
};

export { tagLanes };
