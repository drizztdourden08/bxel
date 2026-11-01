/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { TIMELINE_FRAME_COMMANDS } from '../../src/keymap/timeline-frame-commands.constants';
import { addTag } from '../../src/timeline/add-tag';
import { tagLanes } from '../../src/timeline/tag-lanes';
import { animationOf, freshAnimation, pickRange, run, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const tags = () => animationOf().tags;

const names = (lanes: ReturnType<typeof tagLanes>): string[][] => lanes.map((lane) => lane.map((bar) => bar.name));

const eightWays = (): void => {
  withFrames(4);
  pickRange(0, 1);
  addTag();
  pickRange(1, 2);
  addTag();
  pickRange(3, 3);
  addTag();
  const animation = animationOf().id;
  const [east, north] = tags();
  run('Directions', [
    { name: COMMAND_NAME.animationUpdate, targets: null, options: { animation, directions: 'eight' } },
    { name: COMMAND_NAME.animationTagUpdate, targets: null, options: { animation, tag: { by: 'id', id: east?.id }, facing: 'e' } },
    { name: COMMAND_NAME.animationTagUpdate, targets: null, options: { animation, tag: { by: 'id', id: north?.id }, facing: 'n' } },
    { name: COMMAND_NAME.animationTagAdd, targets: null, options: { animation, kind: 'mirror', of: { by: 'id', id: east?.id }, flip: 'x', facing: 'w' } },
  ]);
};

const command = (id: string) => {
  const found = TIMELINE_FRAME_COMMANDS.find((each) => each.id === id);
  if (!found) throw new Error(`no command ${id}`);
  return found;
};

describe('S2 the tag lanes grouped by facing', { tags: ['standard'] }, () => {
  it('stack by overlap when they are not grouped', () => {
    eightWays();
    expect(names(tagLanes(animationOf(), null))).toEqual([['Tag 1', 'Tag 3'], ['Tag 1 (w)'], ['Tag 2']]);
  });

  it('show one lane per facing in compass order, the tags without a facing last', () => {
    eightWays();
    expect(names(tagLanes(animationOf(), null, true))).toEqual([['Tag 2'], ['Tag 1'], ['Tag 1 (w)'], ['Tag 3']]);
  });

  it('keep the mirror hatched and the source solid', () => {
    eightWays();
    const bars = tagLanes(animationOf(), null, true).flat();
    expect(bars.filter((bar) => bar.mirror).map((bar) => bar.facing)).toEqual(['w']);
    expect(bars.filter((bar) => !bar.mirror && bar.facing !== null).map((bar) => bar.facing)).toEqual(['n', 'e']);
  });

  it('leave the lanes alone when the animation has no directions', () => {
    withFrames(3);
    pickRange(0, 1);
    addTag();
    pickRange(1, 2);
    addTag();
    expect(tagLanes(animationOf(), null, true)).toEqual(tagLanes(animationOf(), null, false));
  });
});

