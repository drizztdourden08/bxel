/* @layer renderer-app @kind logic */
import type { AnimTag, Animation, TagId } from '@bxel/document';
import { spanTagOf } from './span-tag-of';
import { TAG_COLOURS, TAG_DIRECTION_TEXT, TIMELINE_TEXT } from './timeline.constants';
import type { TagCell, TagEdge, TagLook } from './timeline.type';

const edgeOf = (position: number, start: number, end: number): TagEdge => {
  if (start === end) return 'only';
  if (position === start) return 'start';
  return position === end ? 'end' : 'mid';
};

const cellOf = (animation: Animation, tag: AnimTag, look: TagLook): TagCell | null => {
  const base = spanTagOf(animation, tag);
  if (!base) return null;
  const leading = look.edge === 'start' || look.edge === 'only';
  const mirror = tag.kind === 'mirror';
  return {
    tagId: tag.id,
    name: leading ? base.name : '',
    colour: look.colour,
    custom: base.colour ?? null,
    edge: look.edge,
    selected: look.selected,
    roving: look.roving && leading,
    mirror,
    label: tag.kind === 'mirror' ? TIMELINE_TEXT.mirrorLabel(base.name, tag.flip) : TIMELINE_TEXT.tagLabel(base.name, TAG_DIRECTION_TEXT[base.direction]),
  };
};

const rovingTag = (animation: Animation, selectedId: TagId | null): TagId | null =>
  (animation.tags.find((tag) => tag.id === selectedId) ?? animation.tags[0])?.id ?? null;

const tagLanes = (animation: Animation, selectedId: TagId | null): (TagCell | null)[][] => {
  const order = animation.frames.map((frame) => frame.id);
  const roving = rovingTag(animation, selectedId);
  const lanes: (TagCell | null)[][] = [];
  const ends: number[] = [];
  animation.tags.forEach((tag, index) => {
    const base = spanTagOf(animation, tag);
    if (!base) return;
    const from = order.indexOf(base.from);
    const to = order.indexOf(base.to);
    if (from < 0 || to < 0) return;
    const start = Math.min(from, to);
    const end = Math.max(from, to);
    const free = ends.findIndex((last) => last < start);
    const lane = free < 0 ? ends.length : free;
    ends[lane] = end;
    const cells = lanes[lane] ?? order.map(() => null);
    const colour = TAG_COLOURS[index % TAG_COLOURS.length] ?? 'blue';
    const selected = tag.id === selectedId;
    for (let position = start; position <= end; position += 1) {
      cells[position] = cellOf(animation, tag, { colour, edge: edgeOf(position, start, end), selected, roving: tag.id === roving });
    }
    lanes[lane] = cells;
  });
  return lanes;
};

export { tagLanes };
