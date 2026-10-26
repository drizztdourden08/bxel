/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addTag } from '../../src/timeline/add-tag';
import { changeTag } from '../../src/timeline/change-tag';
import { deletePickedTag } from '../../src/timeline/delete-picked-tag';
import { deleteTag } from '../../src/timeline/delete-tag';
import { facingTag } from '../../src/timeline/facing-tag';
import { pickFacing } from '../../src/timeline/pick-facing';
import { setTagColour } from '../../src/timeline/set-tag-colour';
import { setTagRange } from '../../src/timeline/set-tag-range';
import { tagLanes } from '../../src/timeline/tag-lanes';
import { tagOptions } from '../../src/timeline/tag-options';
import { animationOf, frameAt, freshAnimation, live, noticeText, pickRange, run, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const tags = () => animationOf().tags;

describe('tags on the picked frames', () => {
  it('adds a numbered tag over the picked span and picks it', () => {
    withFrames(4);
    pickRange(1, 2);
    addTag();
    expect(tags()).toMatchObject([{ kind: 'span', name: 'Tag 1', from: frameAt(1), to: frameAt(2), direction: 'forward' }]);
    expect(useTimelineStore.getState().tagId).toBe(tags()[0]?.id);
    pickRange(0, 0);
    addTag();
    expect(tags().map((tag) => (tag.kind === 'span' ? tag.name : ''))).toEqual(['Tag 1', 'Tag 2']);
  });

  it('changes the loop mode, the repeat count and the colour, each as one undo step', () => {
    withFrames(3);
    pickRange(0, 2);
    addTag();
    const id = tags()[0]?.id as TagId;
    expect(changeTag('Change tag', id, { direction: 'pingpong', repeat: 3 })).toBe(true);
    expect(setTagColour(id, '#6f9cf0')).toBe(true);
    expect(tags()[0]).toMatchObject({ direction: 'pingpong', repeat: 3, colour: '#6f9cf0' });
    useDocumentStore.getState().host.undo(live().documentId);
    expect(tags()[0]).not.toHaveProperty('colour', '#6f9cf0');
    expect(tags()[0]).toMatchObject({ direction: 'pingpong', repeat: 3 });
  });

  it('moves the range to the picked frames', () => {
    withFrames(4);
    pickRange(0, 1);
    addTag();
    const id = tags()[0]?.id as TagId;
    pickRange(2, 3);
    expect(setTagRange(id)).toBe(true);
    expect(tags()[0]).toMatchObject({ from: frameAt(2), to: frameAt(3) });
  });

  it('refuses a name that is taken and says so', () => {
    withFrames(3);
    pickRange(0, 0);
    addTag();
    pickRange(1, 1);
    addTag();
    const second = tags()[1]?.id as TagId;
    expect(changeTag('Rename tag', second, { name: 'Tag 1' })).toBe(false);
    expect(noticeText()).toBeDefined();
  });

  it('deletes the picked tag and lets go of it', () => {
    withFrames(3);
    pickRange(0, 1);
    addTag();
    expect(deletePickedTag()).toBe(true);
    expect(tags()).toEqual([]);
    expect(useTimelineStore.getState().tagId).toBeNull();
    expect(deletePickedTag()).toBe(false);
  });
});

describe('the tag lanes', () => {
  it('draw each tag over its frames and put overlapping tags in lanes of their own', () => {
    withFrames(4);
    pickRange(0, 2);
    addTag();
    pickRange(1, 3);
    addTag();
    const lanes = tagLanes(animationOf(), null);
    expect(lanes).toHaveLength(2);
    expect(lanes[0]?.map((cell) => cell?.edge ?? null)).toEqual(['start', 'mid', 'end', null]);
    expect(lanes[1]?.map((cell) => cell?.edge ?? null)).toEqual([null, 'start', 'mid', 'end']);
    expect(lanes[0]?.[0]?.name).toBe('Tag 1');
    expect(lanes[0]?.[1]?.name).toBe('');
  });

  it('drop a tag whose frames are gone', () => {
    withFrames(3);
    pickRange(1, 2);
    addTag();
    const id = tags()[0]?.id as TagId;
    deleteTag(id);
    expect(tagLanes(animationOf(), null)).toEqual([]);
  });
});

describe('directions', () => {
  const eightWays = (): void => {
    withFrames(3);
    const animation = animationOf().id;
    pickRange(0, 1);
    addTag();
    const east = tags()[0]?.id;
    run('Directions', [
      { name: COMMAND_NAME.animationUpdate, targets: null, options: { animation, directions: 'eight' } },
      { name: COMMAND_NAME.animationTagUpdate, targets: null, options: { animation, tag: { by: 'id', id: east }, facing: 'e' } },
      { name: COMMAND_NAME.animationTagAdd, targets: null, options: { animation, kind: 'mirror', of: { by: 'id', id: east }, flip: 'x', facing: 'w' } },
    ]);
  };

  it('finds the tag of a facing, mirrors included', () => {
    eightWays();
    expect(facingTag(animationOf(), 'e')?.kind).toBe('span');
    expect(facingTag(animationOf(), 'w')?.kind).toBe('mirror');
    expect(facingTag(animationOf(), 'n')).toBeUndefined();
  });

  it('jumps to the frames of a facing and plays its tag', () => {
    eightWays();
    expect(pickFacing('n')).toBe(false);
    pickRange(2, 2);
    expect(pickFacing('w')).toBe(true);
    expect(useTimelineStore.getState().tagId).toBe(facingTag(animationOf(), 'w')?.id);
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(0), frameAt(1)]);
  });

  it('lists the tags to play, a mirrored one by the tag it copies', () => {
    eightWays();
    expect(tagOptions(animationOf()).map((option) => option.label)).toEqual(['Whole animation', 'Tag 1 (east)', 'Tag 1 (west, mirrored)']);
  });

  it('draws a mirrored tag over the frames of the tag it copies', () => {
    eightWays();
    const lanes = tagLanes(animationOf(), null);
    expect(lanes.flat().filter((cell) => cell?.mirror === true)).toHaveLength(2);
  });
});
