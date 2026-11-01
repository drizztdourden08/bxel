/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { allowPress } from '../../src/editor/allow-press';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { stopPlayback } from '../../src/timeline/stop-playback';
import { tickClock } from '../../src/timeline/tick-clock';
import { togglePlayback } from '../../src/timeline/toggle-playback';
import { advance, begin, clock, restartClock, shown } from './playback-harness';
import { animationOf, freshAnimation, pickRange, revision, target, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

describe('S2 the clock guards', { tags: ['standard'] }, () => {
  it('pauses at once when there is one frame', () => {
    useTimelineStore.getState().play();
    tickClock(5);
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('never changes the document', () => {
    withFrames(4);
    const before = { revision: revision(), animation: animationOf() };
    begin();
    advance(2000);
    expect(revision()).toBe(before.revision);
    expect(animationOf()).toBe(before.animation);
  });

  it('stops when the user starts to draw', () => {
    withFrames(3);
    useTimelineStore.getState().play();
    allowPress({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, target());
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('keeps the picked frames through play and stop', () => {
    withFrames(5);
    pickRange(0, 2);
    const picked = [...useTimelineStore.getState().selection.frames];
    begin();
    advance(450);
    stopPlayback();
    expect(useTimelineStore.getState().selection.frames).toEqual(picked);
    expect(picked).toHaveLength(3);
  });
});

describe('S2 the clock speed and drift', { tags: ['standard'] }, () => {
  it('toggles with one call and runs a speed multiplier', () => {
    withFrames(4);
    useTimelineStore.setState({ speed: 2, rewind: false });
    togglePlayback();
    expect(useTimelineStore.getState().playing).toBe(true);
    restartClock();
    advance(100);
    expect(shown()).toBe(2);
    togglePlayback();
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('holds 12 frames of 100 ms within one frame of drift after 60 seconds', () => {
    withFrames(12);
    begin();
    const start = clock.now;
    for (let tick = 1; clock.now - start < 60_000; tick += 1) {
      clock.now = start + (tick * 1000) / 60;
      tickClock(clock.now);
    }
    const elapsed = clock.now - start;
    const expected = Math.floor((elapsed % 1200) / 100);
    expect(Math.abs(shown() - expected) <= 1 || Math.abs(shown() - expected) === 11).toBe(true);
    expect(useTimelineStore.getState().playing).toBe(true);
  });
});
