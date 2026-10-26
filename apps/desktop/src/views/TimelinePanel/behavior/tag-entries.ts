/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { currentTarget } from '../../../editor/current-target';
import { currentSelection } from '../../../timeline/current-selection';
import { TAG_COLOUR_CHOICES } from '../../../timeline/tag-colour.constants';
import { TAG_DIRECTION_TEXT, TAG_DIRECTIONS } from '../../../timeline/timeline.constants';
import { TIMELINE_MENU } from '../TimelinePanel.constants';

const tagEntries = (tagId: string | undefined): readonly ContextMenuEntry[] => {
  const target = currentTarget();
  const tag = target?.sprite.tags.find((each) => each.id === tagId);
  if (!target || !tag) return [];
  const args = { tagId: tag.id };
  return [
    { command: 'tag.play', label: TIMELINE_MENU.playTag, args },
    { command: 'tag.select_frames', label: TIMELINE_MENU.selectTagFrames, args },
    { command: 'tag.rename', label: TIMELINE_MENU.renameTag, args },
    {
      label: TIMELINE_MENU.direction,
      items: TAG_DIRECTIONS.map((direction) => ({
        command: 'tag.set_direction',
        label: TAG_DIRECTION_TEXT[direction],
        args: { tagId: tag.id, direction },
        kind: 'radio' as const,
        checked: tag.direction === direction,
      })),
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
        { command: 'tag.set_colour', label: TIMELINE_MENU.automaticColour, args: { tagId: tag.id, colour: null }, ...unless(tag.colour !== undefined, TIMELINE_MENU.alreadyAutomatic) },
      ],
    },
    { command: 'tag.set_range', label: TIMELINE_MENU.setRange, args, ...unless(currentSelection(target).frames.length > 0, TIMELINE_MENU.needFrames) },
    'separator',
    { command: 'tag.delete', label: TIMELINE_MENU.deleteTag, args },
  ];
};

export { tagEntries };
