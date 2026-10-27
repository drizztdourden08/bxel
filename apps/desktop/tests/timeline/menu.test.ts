/* @layer renderer-app @kind test */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it } from 'vitest';
import { TIMELINE_MENU_COMMANDS } from '../../src/keymap/timeline-menu-commands.constants';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addTag } from '../../src/timeline/add-tag';
import { frameEntries } from '../../src/views/TimelinePanel/behavior/frame-entries';
import { tagEntries } from '../../src/views/TimelinePanel/behavior/tag-entries';
import { animationOf, frameAt, freshAnimation, pickRange, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const run = (id: string, args: object): void => {
  const command = TIMELINE_MENU_COMMANDS.find((each) => each.id === id);
  if (!command) throw new Error(`no command ${id}`);
  command.run({ args } as never);
};

const labels = (entries: readonly ContextMenuEntry[]): string[] =>
  entries.flatMap((entry) => (typeof entry === 'object' && 'label' in entry && typeof entry.label === 'string' ? [entry.label] : []));

describe('the menu of a frame', () => {
  it('lists the frame commands and no cel commands', () => {
    withFrames(3);
    const text = labels(frameEntries(frameAt(1)));
    expect(text).toEqual(expect.arrayContaining(['Go to frame', 'Play from here', 'Duration', 'Add frame', 'Duplicate frames', 'Move earlier', 'Move later', 'Delete frames']));
    expect(text.join(' ')).not.toMatch(/cel|Link|Layer/);
  });

  it('plays from the frame and sets the duration of the picked frames', () => {
    withFrames(3);
    run('timeline.play_from', { frameId: frameAt(2) });
    expect(useTimelineStore.getState().playing).toBe(true);
    expect(useTimelineStore.getState().frameId).toBe(frameAt(2));
    useTimelineStore.getState().pause();
    pickRange(0, 1);
    run('timeline.set_duration', { ms: 200 });
    expect(animationOf().frames.map((frame) => frame.durationMs)).toEqual([200, 200, 100]);
  });

  it('moves the picked frame later and selects every frame', () => {
    withFrames(3);
    const first = frameAt(0);
    run('timeline.move_frames_later', {});
    expect(animationOf().frames[1]?.id).toBe(first);
    run('timeline.select_all_frames', {});
    expect(useTimelineStore.getState().selection.frames).toHaveLength(3);
  });

  it('refuses to delete every frame in the menu', () => {
    withFrames(2);
    run('timeline.select_all_frames', {});
    const entry = frameEntries(frameAt(0)).find((each) => typeof each === 'object' && 'command' in each && each.command === 'timeline.delete_frames');
    expect(entry).toMatchObject({ disabled: true });
  });
});

describe('the menu of a tag', () => {
  it('sets the direction, the colour and the range, and deletes the tag', () => {
    withFrames(4);
    pickRange(0, 1);
    addTag();
    const tagId = animationOf().tags[0]?.id ?? '';
    expect(labels(tagEntries(tagId))).toEqual(expect.arrayContaining(['Play this tag', 'Rename', 'Direction', 'Colour', 'Delete tag']));
    run('tag.set_direction', { tagId, direction: 'pingpong' });
    run('tag.set_colour', { tagId, colour: '#6f9cf0' });
    pickRange(2, 3);
    run('tag.set_range', { tagId });
    expect(animationOf().tags[0]).toMatchObject({ direction: 'pingpong', colour: '#6f9cf0', from: frameAt(2), to: frameAt(3) });
    run('tag.play', { tagId });
    expect(useTimelineStore.getState().playing).toBe(true);
    useTimelineStore.getState().pause();
    run('tag.delete', { tagId });
    expect(animationOf().tags).toEqual([]);
  });

  it('opens the custom colour picker from the colour submenu', () => {
    withFrames(2);
    pickRange(0, 1);
    addTag();
    const tagId = animationOf().tags[0]?.id ?? '';
    expect(JSON.stringify(tagEntries(tagId))).toContain('tag.custom_colour');
    run('tag.custom_colour', { tagId });
    expect(useTimelineStore.getState()).toMatchObject({ tagId, colourPicker: true });
    useTimelineStore.getState().selectTag(null);
    expect(useTimelineStore.getState().colourPicker).toBe(false);
  });
});
