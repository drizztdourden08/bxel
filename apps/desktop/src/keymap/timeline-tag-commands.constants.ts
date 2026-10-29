/* @layer renderer-app @kind constants */
import type { AnimFacing, TagId } from '@bxel/document';
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { TagArgs } from '../context-menu/menu-args.type';
import { useTimelineStore } from '../stores/useTimelineStore';
import { changeTag } from '../timeline/change-tag';
import { currentFocus } from '../timeline/current-focus';
import { deleteTag } from '../timeline/delete-tag';
import { excludeFromTag } from '../timeline/exclude-from-tag';
import { includeInTag } from '../timeline/include-in-tag';
import { makeMirror } from '../timeline/make-mirror';
import { playTag } from '../timeline/play-tag';
import { selectTag } from '../timeline/select-tag';
import { setTagColour } from '../timeline/set-tag-colour';
import { setTagRange } from '../timeline/set-tag-range';
import { tagById } from '../timeline/tag-by-id';
import { TIMELINE_LABEL } from '../timeline/timeline.constants';
import { COMMAND_GROUP } from './keymap.constants';

const group = COMMAND_GROUP.timeline;

const withTag = (run: (tagId: TagId, args: Partial<TagArgs & { repeat: number; facing: AnimFacing }>) => unknown) => (context?: CommandContext): void => {
  const args = commandArgs<TagArgs & { repeat: number; facing: AnimFacing }>(context);
  const focus = currentFocus();
  const id = (args.tagId as TagId | undefined) ?? null;
  const tag = focus ? tagById(focus.animation, id) : undefined;
  if (tag) run(tag.id, args);
};

const store = useTimelineStore;

const TIMELINE_TAG_COMMANDS: readonly CommandDef[] = [
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

export { TIMELINE_TAG_COMMANDS };
