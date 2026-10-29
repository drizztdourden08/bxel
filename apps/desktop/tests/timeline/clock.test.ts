/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { playSteps } from '../../src/timeline/play-steps';
import { selectTag } from '../../src/timeline/select-tag';
import { setDuration } from '../../src/timeline/set-duration';
import { stopPlayback } from '../../src/timeline/stop-playback';
import { advance, begin, shown, tagFrames } from './playback-harness';
import { animationOf, frameAt, freshAnimation, pickRange, run, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

describe('the clock', () => {
  it('walks the frames in order and wraps while looping', () => {
    withFrames(3);
    begin();
    const seen: number[] = [];
    for (const wait of [100, 100, 100, 100]) {
      advance(wait);
      seen.push(shown());
    }
    expect(seen).toEqual([1, 2, 0, 1]);
  });

  it('keeps a long frame for its whole duration', () => {
    withFrames(3);
    pickRange(1, 1);
    setDuration(300);
    goToFrame(frameAt(0));
    begin();
    advance(150);
    expect(shown()).toBe(1);
    advance(200);
    expect(shown()).toBe(1);
    advance(100);
    expect(shown()).toBe(2);
  });

  it('plays once and stops on the last frame when rewind is off', () => {
    withFrames(3);
    useTimelineStore.setState({ playMode: 'once', rewind: false });
    begin();
    advance(1000);
    expect(useTimelineStore.getState().playing).toBe(false);
    expect(shown()).toBe(2);
  });

  it('rewinds to the frame it began on when playing ends or is stopped', () => {
    withFrames(4);
    goToFrame(frameAt(1));
    begin();
    advance(250);
    expect(shown()).toBe(3);
    stopPlayback();
    expect(shown()).toBe(1);
    useTimelineStore.setState({ rewind: false });
    begin();
    advance(150);
    stopPlayback();
    expect(shown()).toBe(2);
  });
});

describe('the clock on tags', () => {
  it('plays a ping-pong tag out and back', () => {
    withFrames(5);
    const id = tagFrames(1, 3, 'pingpong');
    selectTag(id);
    goToFrame(frameAt(1));
    useTimelineStore.setState({ rewind: false });
    begin();
    const seen: number[] = [];
    for (let step = 0; step < 6; step += 1) {
      advance(100);
      seen.push(shown());
    }
    expect(seen).toEqual([2, 3, 2, 1, 2, 3]);
  });

  it('plays a mirrored tag with its flip', () => {
    withFrames(3);
    const id = tagFrames(0, 2, 'forward');
    const animation = animationOf().id;
    run('Mirror', [
      { name: COMMAND_NAME.animationUpdate, targets: null, options: { animation, directions: 'eight' } },
      { name: COMMAND_NAME.animationTagUpdate, targets: null, options: { animation, tag: { by: 'id', id }, facing: 'e' } },
      { name: COMMAND_NAME.animationTagAdd, targets: null, options: { animation, kind: 'mirror', of: { by: 'id', id }, flip: 'x', facing: 'w' } },
    ]);
    const mirror = animationOf().tags.find((tag) => tag.kind === 'mirror');
    expect(mirror?.kind).toBe('mirror');
    expect(playSteps(animationOf(), mirror?.id ?? null).steps.map((step) => step.flip)).toEqual(['x', 'x', 'x']);
  });

  it('follows a frame the user clicks while it plays', () => {
    withFrames(4);
    begin();
    advance(150);
    expect(shown()).toBe(1);
    goToFrame(frameAt(3));
    advance(20);
    expect(shown()).toBe(3);
  });
});
