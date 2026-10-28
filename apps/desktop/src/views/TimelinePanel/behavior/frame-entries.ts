/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { currentFocus } from '../../../timeline/current-focus';
import { currentSelection } from '../../../timeline/current-selection';
import { spanTagOf } from '../../../timeline/span-tag-of';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { DURATION_CHOICES, SCALE_CHOICES, TIMELINE_MENU } from '../TimelinePanel.constants';
import { addFromEntries } from './add-from-entries';

const noTags = (): ContextMenuEntry => ({ command: 'timeline.add_tag', label: TIMELINE_MENU.noTags, ...unless(false, TIMELINE_MENU.noTags) });

const durationEntries = (shared: number | undefined): ContextMenuEntry => ({
  label: TIMELINE_MENU.duration,
  items: [
    ...DURATION_CHOICES.map((ms) => ({ command: 'timeline.set_duration', label: `${ms} ms`, args: { ms }, kind: 'radio' as const, checked: shared === ms })),
    { command: 'timeline.open_duration', label: TIMELINE_MENU.otherDuration },
    ...SCALE_CHOICES.map((factor) => ({ command: 'timeline.scale_durations', label: `${TIMELINE_MENU.scale} x${factor}`, args: { factor } })),
  ],
});

const moveEntries = (atStart: boolean, atEnd: boolean, many: boolean): ContextMenuEntry => ({
  label: TIMELINE_MENU.move,
  items: [
    { command: 'timeline.move_frames_earlier', label: TIMELINE_MENU.earlier, ...unless(!atStart, TIMELINE_MENU.firstFrame) },
    { command: 'timeline.move_frames_later', label: TIMELINE_MENU.later, ...unless(!atEnd, TIMELINE_MENU.lastFrame) },
    { command: 'timeline.move_frames_start', label: TIMELINE_MENU.toStart, ...unless(!atStart, TIMELINE_MENU.firstFrame) },
    { command: 'timeline.move_frames_end', label: TIMELINE_MENU.toEnd, ...unless(!atEnd, TIMELINE_MENU.lastFrame) },
    { command: 'timeline.move_frames_to', label: TIMELINE_MENU.toPosition },
    { command: 'timeline.reverse_frames', label: TIMELINE_MENU.reverse, ...unless(many, TIMELINE_TEXT.needTwo) },
  ],
});

const frameEntries = (frameId: string | undefined): readonly ContextMenuEntry[] => {
  const focus = currentFocus();
  if (!focus) return [];
  const { frames, tags } = focus.animation;
  const all = frames.map((frame) => frame.id);
  const picked = currentSelection(focus);
  const durations = new Set(frames.filter((frame) => picked.includes(frame.id)).map((frame) => frame.durationMs));
  const shared = durations.size === 1 ? [...durations][0] : undefined;
  const sprite = frames.find((frame) => frame.id === frameId)?.spriteId;
  const kind = sprite === null || sprite === undefined ? undefined : findSprite(focus.artwork, sprite)?.role;
  const spans = tags.flatMap((tag) => (tag.kind === 'span' ? [tag] : []));
  return [
    { command: 'timeline.play_from', label: TIMELINE_MENU.playFrom, args: { frameId } },
    durationEntries(shared),
    { command: 'timeline.add_frame', label: TIMELINE_MENU.addFrame },
    addFromEntries(),
    { command: 'timeline.duplicate_frames', label: TIMELINE_MENU.duplicateFrames },
    { command: 'timeline.linked_copy', label: TIMELINE_MENU.linkedCopy, ...unless(sprite !== null && sprite !== undefined, TIMELINE_MENU.noSprite) },
    moveEntries(picked.some((id) => all.indexOf(id) === 0), picked.some((id) => all.indexOf(id) === all.length - 1), picked.length > 1),
    {
      label: TIMELINE_MENU.tagMenu,
      items: [
        { command: 'timeline.add_tag', label: TIMELINE_MENU.addTag },
        {
          label: TIMELINE_MENU.addToTag,
          items: spans.length === 0 ? [noTags()] : spans.map((tag) => ({ command: 'tag.include_frames', label: tag.name, args: { tagId: tag.id } })),
        },
        {
          label: TIMELINE_MENU.removeFromTag,
          items: spans.length === 0 ? [noTags()] : spans.map((tag) => ({ command: 'tag.exclude_frames', label: tag.name, args: { tagId: tag.id } })),
        },
      ],
    },
    {
      label: TIMELINE_MENU.select,
      items: [
        { command: 'timeline.select_all_frames', label: TIMELINE_MENU.selectAll },
        { command: 'timeline.select_same_sprite', label: TIMELINE_MENU.selectSame },
        {
          label: TIMELINE_MENU.selectTagFrames,
          items: spans.length === 0 ? [noTags()] : spans.map((tag) => ({ command: 'tag.select_frames', label: spanTagOf(focus.animation, tag)?.name ?? tag.name, args: { tagId: tag.id } })),
        },
        { command: 'timeline.invert_selection', label: TIMELINE_MENU.invert },
      ],
    },
    {
      label: TIMELINE_MENU.sprite,
      items: [
        { command: 'timeline.open_sprite', label: TIMELINE_MENU.openSprite, ...unless(kind === 'sprite', TIMELINE_MENU.noSprite) },
        { command: 'timeline.make_copy', label: TIMELINE_MENU.makeCopy, ...unless(kind === 'sprite', TIMELINE_MENU.noSprite) },
      ],
    },
    {
      label: TIMELINE_MENU.clipboard,
      items: [
        { command: 'timeline.copy_frames', label: TIMELINE_MENU.copy },
        { command: 'timeline.cut_frames', label: TIMELINE_MENU.cut },
        { command: 'timeline.paste_frames', label: TIMELINE_MENU.paste },
        { command: 'timeline.paste_linked', label: TIMELINE_MENU.pasteLinked },
      ],
    },
    'separator',
    { command: 'timeline.delete_frames', label: TIMELINE_MENU.deleteFrames, ...unless(frames.length > picked.length, TIMELINE_MENU.oneFrame) },
  ];
};

export { frameEntries };
