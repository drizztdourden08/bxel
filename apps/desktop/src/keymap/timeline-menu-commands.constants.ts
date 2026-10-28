/* @layer renderer-app @kind constants */
import type { TagId } from '@bxel/document';
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { DurationArgs, FrameArgs, TagArgs } from '../context-menu/menu-args.type';
import { useTimelineStore } from '../stores/useTimelineStore';
import { addFrame } from '../timeline/add-frame';
import { useAddFramesStore } from '../stores/useAddFramesStore';
import { useDirectionSetStore } from '../stores/useDirectionSetStore';
import { addTag } from '../timeline/add-tag';
import { changeTag } from '../timeline/change-tag';
import { currentFocus } from '../timeline/current-focus';
import { deleteFrames } from '../timeline/delete-frames';
import { deleteTag } from '../timeline/delete-tag';
import { duplicateFrames } from '../timeline/duplicate-frames';
import { exportFrames } from '../timeline/export-frames';
import { makeSpritesheet } from '../timeline/make-spritesheet';
import { splitToSprites } from '../timeline/split-to-sprites';
import { focusField } from '../timeline/focus-field';
import { goToFrame } from '../timeline/go-to-frame';
import { moveFrames } from '../timeline/move-frames';
import { playFrom } from '../timeline/play-from';
import { playTag } from '../timeline/play-tag';
import { selectAllFrames } from '../timeline/select-all-frames';
import { selectTag } from '../timeline/select-tag';
import { setDuration } from '../timeline/set-duration';
import { setTagColour } from '../timeline/set-tag-colour';
import { setTagRange } from '../timeline/set-tag-range';
import { tagById } from '../timeline/tag-by-id';
import { FIELD_LABEL, TIMELINE_LABEL } from '../timeline/timeline.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const group = COMMAND_GROUP.timeline;

const withTag = (run: (tagId: TagId, args: Partial<TagArgs>) => unknown) => (context?: CommandContext): void => {
  const args = commandArgs<TagArgs>(context);
  const focus = currentFocus();
  const id = (args.tagId as TagId | undefined) ?? null;
  const tag = focus ? tagById(focus.animation, id) : undefined;
  if (tag) run(tag.id, args);
};

const FRAME_COMMANDS: readonly CommandDef[] = [
  { id: 'timeline.add_frame', label: 'Add a frame', group, run: () => addFrame() },
  { id: 'timeline.duplicate_frames', label: 'Duplicate the selected frames', group, run: () => duplicateFrames() },
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
  { id: 'timeline.select_all_frames', label: 'Select all frames', group, run: () => selectAllFrames() },
  { id: 'timeline.add_tag', label: 'Add a tag on the selected frames', group, run: () => addTag() },
  {
    id: 'timeline.go_to_frame',
    label: 'Go to a frame',
    group,
    run: (context?: CommandContext) => {
      const frame = currentFocus()?.animation.frames.find((each) => each.id === commandArgs<FrameArgs>(context).frameId);
      if (frame) goToFrame(frame.id);
    },
  },
  { id: 'timeline.play_from', label: 'Play from a frame', group, run: (context?: CommandContext) => playFrom(commandArgs<FrameArgs>(context).frameId ?? '') },
  {
    id: 'timeline.set_duration',
    label: 'Set the duration of the selected frames',
    group,
    run: (context?: CommandContext) => {
      const { ms } = commandArgs<DurationArgs>(context);
      if (ms !== undefined) setDuration(ms);
    },
  },
  { id: 'timeline.focus_duration', label: 'Type a frame duration', group, run: () => focusField(FIELD_LABEL.duration) },
  {
    id: 'timeline.toggle_onion',
    label: 'Turn onion skin on or off',
    group,
    checked: () => useTimelineStore.getState().onion.on,
    run: () => useTimelineStore.getState().setOnion({ on: !useTimelineStore.getState().onion.on }),
  },
];

const TAG_COMMANDS: readonly CommandDef[] = [
  { id: 'tag.play', label: 'Play a tag', group, run: withTag((tagId) => playTag(tagId)) },
  { id: 'tag.select_frames', label: 'Select the frames of a tag', group, run: withTag((tagId) => selectTag(tagId)) },
  {
    id: 'tag.rename',
    label: 'Rename a tag',
    group,
    run: withTag((tagId) => {
      selectTag(tagId);
      focusField(FIELD_LABEL.tagName);
    }),
  },
  {
    id: 'tag.set_direction',
    label: 'Set the direction of a tag',
    group,
    run: withTag((tagId, args) => args.direction !== undefined && changeTag(TIMELINE_LABEL.updateTag, tagId, { direction: args.direction })),
  },
  { id: 'tag.set_colour', label: 'Set the colour of a tag', group, run: withTag((tagId, args) => args.colour !== undefined && setTagColour(tagId, args.colour)) },
  {
    id: 'tag.custom_colour',
    label: 'Pick a custom colour for a tag',
    group,
    run: withTag((tagId) => {
      selectTag(tagId);
      useTimelineStore.getState().setColourPicker(true);
    }),
  },
  { id: 'tag.set_range', label: 'Set the range of a tag to the selected frames', group, run: withTag((tagId) => setTagRange(tagId)) },
  { id: 'tag.delete', label: 'Delete a tag', group, run: withTag((tagId) => deleteTag(tagId)) },
];

const TIMELINE_MENU_COMMANDS: readonly CommandDef[] = [...FRAME_COMMANDS, ...TAG_COMMANDS].map(ruled);

export { TIMELINE_MENU_COMMANDS };
