/* @layer renderer-app @kind test */
import type { TagId } from '@bxel/document';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addTag } from '../../src/timeline/add-tag';
import { changeTag } from '../../src/timeline/change-tag';
import { resetClock } from '../../src/timeline/reset-clock';
import { tickClock } from '../../src/timeline/tick-clock';
import { animationOf, frameIds, live, pickRange } from './timeline-harness';

const clock = { now: 1000 };

const tagFrames = (first: number, last: number, direction: 'forward' | 'reverse' | 'pingpong' | 'pingpongReverse'): TagId => {
  pickRange(first, last);
  addTag();
  const id = animationOf().tags.at(-1)?.id;
  if (!id) throw new Error('no tag');
  changeTag('Change tag', id, { direction });
  return id;
};

const restartClock = (): void => {
  resetClock();
  clock.now = 1000;
  tickClock(clock.now);
};

const begin = (): void => {
  resetClock();
  clock.now = 1000;
  useTimelineStore.getState().play();
  tickClock(clock.now);
};

const advance = (ms: number, step = 16): void => {
  const end = clock.now + ms;
  while (clock.now < end && useTimelineStore.getState().playing) {
    clock.now = Math.min(end, clock.now + step);
    tickClock(clock.now);
  }
};

const shown = (): number => frameIds().indexOf(live().frame.id);

export { advance, begin, clock, restartClock, shown, tagFrames };
