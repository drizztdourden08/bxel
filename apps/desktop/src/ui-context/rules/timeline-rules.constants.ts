/* @layer renderer-app @kind constants */
import { file } from '../predicates.constants';
import { ONLY } from '../reasons.constants';
import { family } from './family';
import { ONION, TIMELINE, WRITE } from './groups.constants';
import type { RuleTable } from './rule-table.type';

const WRITING = [
  'timeline.delete', 'timeline.add_frame', 'timeline.duplicate_frames', 'timeline.add_from_sprites', 'timeline.add_from_strip', 'timeline.add_from_sheet', 'timeline.add_from_images',
  'timeline.new_direction_set', 'timeline.split_to_sprites', 'timeline.delete_frames', 'timeline.move_frames_earlier', 'timeline.move_frames_later',
  'timeline.add_tag', 'timeline.set_duration', 'timeline.set_duration_of', 'tag.rename', 'tag.set_direction', 'tag.set_colour', 'tag.custom_colour', 'tag.set_range', 'tag.delete',
  'timeline.paste_frames', 'timeline.paste_linked', 'timeline.open_duration', 'timeline.move_frames_start', 'timeline.move_frames_end', 'timeline.move_frames_to',
  'timeline.reverse_frames', 'timeline.linked_copy', 'timeline.make_copy', 'timeline.move_to_own_file', 'timeline.scale_durations', 'tag.edit', 'tag.set_repeat', 'tag.set_facing',
  'tag.include_frames', 'tag.exclude_frames', 'tag.make_mirror',
];

const WATCHING = [
  'timeline.make_spritesheet', 'timeline.export_frames', 'timeline.select_all_frames', 'timeline.go_to_frame', 'timeline.play_from',
  'tag.play', 'tag.select_frames', 'timeline.copy_frames', 'timeline.cut_frames', 'timeline.select_same_sprite', 'timeline.invert_selection',
  'timeline.open_sprite', 'timeline.show_in_project', 'timeline.toggle_play_paint', 'timeline.toggle_play', 'tag.play_once',
];

const ANIMATION_VIEW = [
  'timeline.set_loop_range', 'timeline.clear_loop_range', 'timeline.set_units', 'timeline.set_zoom', 'timeline.onion_settings', 'timeline.toggle_time_mode',
  'timeline.toggle_group_facing',
];

const TIMELINES: RuleTable = {
  ...family(WRITING, TIMELINE, [WRITE], ONLY.animations),
  ...family(WATCHING, TIMELINE, [], ONLY.animations),
  ...family(ANIMATION_VIEW, file('animation'), [], ONLY.animations),
  ...family(['timeline.toggle_onion'], ONION, [], ONLY.animations),
};

export { TIMELINES };
