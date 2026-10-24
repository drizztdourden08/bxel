/* @layer renderer-app @kind logic */
import type { Sprite, Tag, TagId } from '@bxel/document';
import { TAG_COLOURS, TAG_DIRECTION_TEXT, TIMELINE_TEXT } from './timeline.constants';
import type { TagCell, TagEdge } from './timeline.type';

const edgeOf = (position: number, start: number, end: number): TagEdge => {
  if (start === end) return 'only';
  if (position === start) return 'start';
  return position === end ? 'end' : 'mid';
};

const cellOf = (tag: Tag, colour: string, edge: TagEdge, selected: boolean): TagCell => ({
  tagId: tag.id,
  name: edge === 'start' || edge === 'only' ? tag.name : '',
  colour,
  edge,
  selected,
  label: TIMELINE_TEXT.tagLabel(tag.name, TAG_DIRECTION_TEXT[tag.direction]),
});

const tagLanes = (sprite: Sprite, selectedId: TagId | null): (TagCell | null)[][] => {
  const order = sprite.frames.map((frame) => frame.id);
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
    for (let position = start; position <= end; position += 1) cells[position] = cellOf(tag, colour, edgeOf(position, start, end), tag.id === selectedId);
    lanes[lane] = cells;
  });
  return lanes;
};

export { tagLanes };
