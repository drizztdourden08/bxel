/* @layer renderer-app @kind logic */
import { ALL_FACINGS, FACING_SETS } from '@bxel/document';
import type { AnimSpanTag, Animation } from '@bxel/document';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { currentFocus } from '../../../timeline/current-focus';
import { currentSelection } from '../../../timeline/current-selection';
import { facingTag } from '../../../timeline/facing-tag';
import { TAG_COLOUR_CHOICES } from '../../../timeline/tag-colour.constants';
import { FACING_TEXT, TAG_DIRECTION_TEXT, TAG_DIRECTIONS } from '../../../timeline/timeline.constants';
import { TIMELINE_MENU } from '../TimelinePanel.menu.constants';
import { REPEATS } from './tag-entries.constants';

const mirrorEntries = (tag: AnimSpanTag, animation: Animation): ContextMenuEntry => ({
  label: TIMELINE_MENU.makeMirror,
  items: FACING_SETS[animation.directions]
    .filter((facing) => facingTag(animation, facing) === undefined)
    .map((facing) => ({ command: 'tag.make_mirror', label: FACING_TEXT[facing], args: { tagId: tag.id, facing } })),
});

const spanEntries = (tag: AnimSpanTag, picked: number, animation: Animation): readonly ContextMenuEntry[] => [
  { command: 'tag.edit', label: TIMELINE_MENU.editTag, args: { tagId: tag.id } },
  {
    label: TIMELINE_MENU.loopMode,
    items: TAG_DIRECTIONS.map((direction) => ({
      command: 'tag.set_direction',
      label: TAG_DIRECTION_TEXT[direction],
      args: { tagId: tag.id, direction },
      kind: 'radio' as const,
      checked: tag.direction === direction,
    })),
  },
  {
    label: TIMELINE_MENU.repeat,
    items: [
      { command: 'tag.set_repeat', label: TIMELINE_MENU.forever, args: { tagId: tag.id, repeat: 0 }, kind: 'radio' as const, checked: tag.repeat === 0 },
      ...REPEATS.map((repeat) => ({ command: 'tag.set_repeat', label: String(repeat), args: { tagId: tag.id, repeat }, kind: 'radio' as const, checked: tag.repeat === repeat })),
      { command: 'tag.edit', label: TIMELINE_MENU.otherRepeat, args: { tagId: tag.id } },
    ],
  },
  {
    label: TIMELINE_MENU.facing,
    items: [
      { command: 'tag.set_facing', label: 'None', args: { tagId: tag.id }, kind: 'radio' as const, checked: tag.facing === undefined },
      ...ALL_FACINGS.map((facing) => ({ command: 'tag.set_facing', label: FACING_TEXT[facing], args: { tagId: tag.id, facing }, kind: 'radio' as const, checked: tag.facing === facing })),
    ],
  },
  {
    label: TIMELINE_MENU.colour,
    items: [
      ...TAG_COLOUR_CHOICES.map((choice) => ({
        command: 'tag.set_colour',
        label: choice.name,
        args: { tagId: tag.id, colour: choice.hex },
        kind: 'radio' as const,
        checked: tag.colour === choice.hex,
      })),
      { command: 'tag.custom_colour', label: TIMELINE_MENU.customColour, args: { tagId: tag.id } },
      { command: 'tag.set_colour', label: TIMELINE_MENU.automaticColour, args: { tagId: tag.id, colour: null }, ...unless(tag.colour !== undefined, TIMELINE_MENU.alreadyAutomatic) },
    ],
  },
  { command: 'tag.set_range', label: TIMELINE_MENU.setRange, args: { tagId: tag.id }, ...unless(picked > 0, TIMELINE_MENU.needFrames) },
  mirrorEntries(tag, animation),
];

const tagEntries = (tagId: string | undefined): readonly ContextMenuEntry[] => {
  const focus = currentFocus();
  const tag = focus?.animation.tags.find((each) => each.id === tagId);
  if (!focus || !tag) return [];
  const args = { tagId: tag.id };
  return [
    { command: 'tag.play', label: TIMELINE_MENU.playTag, args },
    { command: 'tag.play_once', label: TIMELINE_MENU.playOnce, args },
    { command: 'tag.select_frames', label: TIMELINE_MENU.selectTagFrames, args },
    ...(tag.kind === 'span' ? spanEntries(tag, currentSelection(focus).length, focus.animation) : []),
    'separator',
    { command: 'tag.delete', label: TIMELINE_MENU.deleteTag, args },
  ];
};

export { tagEntries };
