/* @layer renderer-app @kind constants */
import type { AnimFacing, TagId } from '@bxel/document';
import { nav } from '@drizztdourden08/brock-react';
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { DurationArgs, FrameArgs, TagArgs } from '../context-menu/menu-args.type';
import type { TimeUnits } from '../stores/timeline-store.type';
import { useAddFramesStore } from '../stores/useAddFramesStore';
import { useDirectionSetStore } from '../stores/useDirectionSetStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { addFrame } from '../timeline/add-frame';
import { addTag } from '../timeline/add-tag';
import { changeTag } from '../timeline/change-tag';
import { copyFrames } from '../timeline/copy-frames';
import { currentFocus } from '../timeline/current-focus';
import { deleteFrames } from '../timeline/delete-frames';
import { deleteTag } from '../timeline/delete-tag';
import { duplicateFrames } from '../timeline/duplicate-frames';
import { exportFrames } from '../timeline/export-frames';
import { goToFrame } from '../timeline/go-to-frame';
import { linkedCopy } from '../timeline/linked-copy';
import { makeMirror } from '../timeline/make-mirror';
import { makeSpritesheet } from '../timeline/make-spritesheet';
import { moveFrames } from '../timeline/move-frames';
import { moveFramesTo } from '../timeline/move-frames-to';
import { openSprite } from '../timeline/open-sprite';
import { ownFrame } from '../timeline/own-frame';
import { pasteFrames } from '../timeline/paste-frames';
import { playFrom } from '../timeline/play-from';
import { playTag } from '../timeline/play-tag';
import { reverseFrames } from '../timeline/reverse-frames';
import { scaleDurations } from '../timeline/scale-durations';
import { selectAllFrames } from '../timeline/select-all-frames';
import { selectFramesWhere } from '../timeline/select-frames-where';
import { selectTag } from '../timeline/select-tag';
import { setDuration } from '../timeline/set-duration';
import { setTagColour } from '../timeline/set-tag-colour';
import { setTagRange } from '../timeline/set-tag-range';
import { splitToSprites } from '../timeline/split-to-sprites';
import { excludeFromTag, includeInTag } from '../timeline/tag-membership';
import { tagById } from '../timeline/tag-by-id';
import { TIMELINE_LABEL } from '../timeline/timeline.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const group = COMMAND_GROUP.timeline;

const ANIMATION_PAGE = 'app/animation';

const withTag = (run: (tagId: TagId, args: Partial<TagArgs & { repeat: number; facing: AnimFacing }>) => unknown) => (context?: CommandContext): void => {
  const args = commandArgs<TagArgs & { repeat: number; facing: AnimFacing }>(context);
  const focus = currentFocus();
  const id = (args.tagId as TagId | undefined) ?? null;
  const tag = focus ? tagById(focus.animation, id) : undefined;
  if (tag) run(tag.id, args);
};

const store = useTimelineStore;

const FRAME_COMMANDS: readonly CommandDef[] = [
  { id: 'timeline.add_frame', label: 'Add a frame', group, run: () => addFrame() },
  { id: 'timeline.duplicate_frames', label: 'Duplicate the selected frames', group, run: () => duplicateFrames() },
  { id: 'timeline.select_all_frames', label: 'Select all frames', group, run: () => selectAllFrames() },
  { id: 'timeline.copy_frames', label: 'Copy the picked frames', group, run: () => void copyFrames(false) },
  { id: 'timeline.cut_frames', label: 'Cut the picked frames', group, run: () => void copyFrames(true) },
  { id: 'timeline.paste_frames', label: 'Paste frames after the current frame', group, run: () => void pasteFrames(false) },
  { id: 'timeline.paste_linked', label: 'Paste frames as linked copies', group, run: () => void pasteFrames(true) },
  { id: 'timeline.open_duration', label: 'Set the duration of the selected frames', group, run: () => store.getState().setPopover({ kind: 'duration' }) },
  { id: 'timeline.move_frames_start', label: 'Move the selected frames to the start', group, run: () => void moveFramesTo(0) },
  { id: 'timeline.move_frames_end', label: 'Move the selected frames to the end', group, run: () => void moveFramesTo(Number.MAX_SAFE_INTEGER) },
  {
    id: 'timeline.toggle_onion',
    label: 'Turn onion skin on or off',
    group,
    checked: () => store.getState().onion.on,
    run: () => store.getState().setOnion({ on: !store.getState().onion.on }),
  },
  {
    id: 'timeline.toggle_time_mode',
    label: 'Show frame widths as durations',
    group,
    checked: () => store.getState().timeMode,
    run: () => store.getState().setTimeMode(!store.getState().timeMode),
  },
  { id: 'timeline.add_tag', label: 'Add a tag on the selected frames', group, run: () => addTag() },
  { id: 'timeline.add_from_sprites', label: 'Add frames from sprites', group, run: () => useAddFramesStore.getState().show('sprites') },
  { id: 'timeline.add_from_strip', label: 'Add frames from a strip', group, run: () => useAddFramesStore.getState().show('strip') },
  { id: 'timeline.add_from_sheet', label: 'Add frames from a sheet', group, run: () => useAddFramesStore.getState().show('sheet') },
  { id: 'timeline.new_direction_set', label: 'Make a new direction set', group, run: () => useDirectionSetStore.getState().show() },
  { id: 'timeline.split_to_sprites', label: 'Split the frames into sprites', group, run: () => void splitToSprites() },
  { id: 'timeline.make_spritesheet', label: 'Make a spritesheet of the animation', group, run: () => void makeSpritesheet() },
  { id: 'timeline.export_frames', label: 'Export the frames as images', group, run: () => exportFrames() },
  { id: 'timeline.delete_frames', label: 'Delete the selected frames', group, run: () => deleteFrames() },
  { id: 'timeline.move_frames_earlier', label: 'Move the selected frames earlier', group, run: () => void moveFrames(-1) },
  { id: 'timeline.move_frames_later', label: 'Move the selected frames later', group, run: () => void moveFrames(1) },
  {
    id: 'timeline.move_frames_to',
    label: 'Move the selected frames to a position',
    group,
    run: (context?: CommandContext) => {
      const { position } = commandArgs<{ position: number }>(context);
      if (position === undefined) store.getState().setPopover({ kind: 'position' });
      else void moveFramesTo(position - 1);
    },
  },
  { id: 'timeline.reverse_frames', label: 'Reverse the order of the selected frames', group, run: () => void reverseFrames() },
  { id: 'timeline.linked_copy', label: 'Make linked copies of the selected frames', group, run: () => void linkedCopy() },
  { id: 'timeline.select_same_sprite', label: 'Select the frames that show the same sprite', group, run: () => void selectFramesWhere('same-sprite') },
  { id: 'timeline.invert_selection', label: 'Invert the picked frames', group, run: () => void selectFramesWhere('invert') },
  { id: 'timeline.open_sprite', label: 'Open the sprite of the current frame', group, run: () => void openSprite() },
  { id: 'timeline.make_copy', label: 'Make a copy of the sprite for this animation', group, run: () => void ownFrame(TIMELINE_LABEL.copy) },
  {
    id: 'timeline.go_to_frame',
    label: 'Go to a frame',
    group,
    run: (context?: CommandContext) => {
      const frame = currentFocus()?.animation.frames.find((each) => each.id === commandArgs<FrameArgs>(context).frameId);
      if (frame) goToFrame(frame.id);
    },
  },
  { id: 'timeline.play_from', label: 'Play from a frame', group, run: (context?: CommandContext) => playFrom(commandArgs<FrameArgs>(context).frameId ?? currentFocus()?.frame.id ?? '') },
  {
    id: 'timeline.set_duration',
    label: 'Set the duration of the selected frames',
    group,
    run: (context?: CommandContext) => {
      const { ms } = commandArgs<DurationArgs>(context);
      if (ms !== undefined) setDuration(ms);
    },
  },
  {
    id: 'timeline.scale_durations',
    label: 'Scale the durations of the selected frames',
    group,
    run: (context?: CommandContext) => {
      const { factor } = commandArgs<{ factor: number }>(context);
      if (factor !== undefined) scaleDurations(factor);
    },
  },
  {
    id: 'timeline.set_loop_range',
    label: 'Set the loop range to the picked frames',
    group,
    run: () => {
      const focus = currentFocus();
      const picked = store.getState().selection.frames;
      const order = focus?.animation.frames.map((frame) => frame.id) ?? [];
      const ids = order.filter((id) => picked.includes(id));
      const [from, to] = [ids[0], ids.at(-1)];
      if (from !== undefined && to !== undefined && from !== to) store.getState().setLoopRange({ from, to });
    },
  },
  { id: 'timeline.clear_loop_range', label: 'Clear the loop range', group, run: () => store.getState().setLoopRange(null) },
  {
    id: 'timeline.set_units',
    label: 'Set the time units',
    group,
    run: (context?: CommandContext) => {
      const { units } = commandArgs<{ units: TimeUnits }>(context);
      if (units !== undefined) store.getState().setUnits(units);
    },
  },
  {
    id: 'timeline.set_zoom',
    label: 'Set the frame size',
    group,
    run: (context?: CommandContext) => {
      const { size } = commandArgs<{ size: number | 'fit' }>(context);
      if (size === 'fit') store.getState().setFit(true);
      else if (size !== undefined) store.getState().setZoom(size);
    },
  },
  { id: 'timeline.onion_settings', label: 'Open the animation settings', group, run: () => nav.open(ANIMATION_PAGE) },
];

const TAG_COMMANDS: readonly CommandDef[] = [
  { id: 'tag.play', label: 'Play a tag', group, run: withTag((tagId) => playTag(tagId)) },
  {
    id: 'tag.play_once',
    label: 'Play a tag once',
    group,
    run: withTag((tagId) => {
      playTag(tagId);
      store.getState().pause();
      store.getState().playOnceNow();
    }),
  },
  { id: 'tag.select_frames', label: 'Select the frames of a tag', group, run: withTag((tagId) => selectTag(tagId)) },
  { id: 'tag.edit', label: 'Edit a tag', group, run: withTag((tagId) => store.getState().setPopover({ kind: 'tag', tagId })) },
  {
    id: 'tag.rename',
    label: 'Rename a tag',
    group,
    run: withTag((tagId) => {
      selectTag(tagId);
      store.getState().setPopover({ kind: 'tag', tagId });
    }),
  },
  {
    id: 'tag.set_direction',
    label: 'Set the direction of a tag',
    group,
    run: withTag((tagId, args) => args.direction !== undefined && changeTag(TIMELINE_LABEL.updateTag, tagId, { direction: args.direction })),
  },
  {
    id: 'tag.set_repeat',
    label: 'Set how often a tag repeats',
    group,
    run: withTag((tagId, args) => args.repeat !== undefined && changeTag(TIMELINE_LABEL.updateTag, tagId, { repeat: args.repeat })),
  },
  {
    id: 'tag.set_facing',
    label: 'Set the facing of a tag',
    group,
    run: withTag((tagId, args) => changeTag(TIMELINE_LABEL.updateTag, tagId, { facing: args.facing ?? null })),
  },
  { id: 'tag.set_colour', label: 'Set the colour of a tag', group, run: withTag((tagId, args) => args.colour !== undefined && setTagColour(tagId, args.colour)) },
  {
    id: 'tag.custom_colour',
    label: 'Pick a custom colour for a tag',
    group,
    run: withTag((tagId) => {
      selectTag(tagId);
      store.getState().setPopover({ kind: 'tag', tagId });
      store.getState().setColourPicker(true);
    }),
  },
  { id: 'tag.set_range', label: 'Set the range of a tag to the selected frames', group, run: withTag((tagId) => setTagRange(tagId)) },
  { id: 'tag.include_frames', label: 'Add the selected frames to a tag', group, run: withTag((tagId) => includeInTag(tagId)) },
  { id: 'tag.exclude_frames', label: 'Remove the selected frames from a tag', group, run: withTag((tagId) => excludeFromTag(tagId)) },
  { id: 'tag.make_mirror', label: 'Make a mirror of a tag', group, run: withTag((tagId, args) => args.facing !== undefined && makeMirror(tagId, args.facing)) },
  { id: 'tag.delete', label: 'Delete a tag', group, run: withTag((tagId) => deleteTag(tagId)) },
];

const TIMELINE_MENU_COMMANDS: readonly CommandDef[] = [...FRAME_COMMANDS, ...TAG_COMMANDS].map(ruled);

export { TIMELINE_MENU_COMMANDS };
