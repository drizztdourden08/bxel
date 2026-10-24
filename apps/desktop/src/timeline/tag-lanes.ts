/* @layer renderer-app @kind logic */
import type { Sprite, Tag, TagId } from '@bxel/document';
import { TAG_COLOURS, TAG_DIRECTION_TEXT, TIMELINE_TEXT } from './timeline.constants';
import type { TagCell, TagEdge, TagLook } from './timeline.type';

const edgeOf = (position: number, start: number, end: number): TagEdge => {
  if (start === end) return 'only';
  if (position === start) return 'start';
  return position === end ? 'end' : 'mid';
};

const cellOf = (tag: Tag, look: TagLook): TagCell => {
  const leading = look.edge === 'start' || look.edge === 'only';
  return {
    tagId: tag.id,
    name: leading ? tag.name : '',
    colour: look.colour,
    custom: tag.colour ?? null,
    edge: look.edge,
    selected: look.selected,
    roving: look.roving && leading,
    label: TIMELINE_TEXT.tagLabel(tag.name, TAG_DIRECTION_TEXT[tag.direction]),
  };
};

const rovingTag = (sprite: Sprite, selectedId: TagId | null): TagId | null =>
  (sprite.tags.find((tag) => tag.id === selectedId) ?? sprite.tags[0])?.id ?? null;

const tagLanes = (sprite: Sprite, selectedId: TagId | null): (TagCell | null)[][] => {
  const order = sprite.frames.map((frame) => frame.id);
  const roving = rovingTag(sprite, selectedId);
  const lanes: (TagCell | null)[][] = [];
  const ends: number[] = [];
  sprite.tags.forEach((tag, index) => {
    const from = order.indexOf(tag.from);
    const to = order.indexOf(tag.to);
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
      cells[position] = cellOf(tag, { colour, edge: edgeOf(position, start, end), selected, roving: tag.id === roving });
    }
    lanes[lane] = cells;
  });
  return lanes;
};

export { tagLanes };
