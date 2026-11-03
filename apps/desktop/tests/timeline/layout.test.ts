/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { ONION_DEFAULTS } from '../../src/stores/timeline-store.constants';
import { formatClock } from '../../src/timeline/format-clock';
import { formatDuration } from '../../src/timeline/format-duration';
import { indexAtX } from '../../src/timeline/index-at-x';
import { readOnion } from '../../src/timeline/read-onion';
import { readPlay } from '../../src/timeline/read-play';
import { readSavedView } from '../../src/timeline/read-saved-view';
import { readZoom } from '../../src/timeline/read-zoom';
import { snapDuration } from '../../src/timeline/snap-duration';
import { stepZoom } from '../../src/timeline/step-zoom';
import { cellWidth } from '../../src/timeline/cell-width';
import { fitThumb } from '../../src/timeline/fit-thumb';
import { trackLayout } from '../../src/timeline/track-layout';
import { writeAnimationSettings } from '../../src/timeline/write-animation-settings';
import { draftedDurations } from '../../src/timeline/drafted-durations';

describe('K1 the track layout', { tags: ['critical'] }, () => {
  it('gives every frame the same width by thumbnail size', () => {
    const layout = trackLayout([100, 200, 50], 48, false);
    expect(layout.widths).toEqual([56, 56, 56]);
    expect(layout.lefts).toEqual([0, 56, 112]);
    expect(layout.total).toBe(168);
    expect(cellWidth(24)).toBe(40);
  });

  it('makes cell width follow duration in time mode', () => {
    const layout = trackLayout([100, 200, 50], 48, true);
    expect(layout.widths).toEqual([56, 112, 28]);
    expect(layout.pxPerMs).toBeCloseTo(0.56);
    expect(indexAtX(layout, 60)).toBe(1);
    expect(indexAtX(layout, 190)).toBe(2);
  });

  it('fits the whole range, from 96 pixels down to 16', () => {
    expect(fitThumb([100, 100], 2000, false)).toBe(96);
    expect(fitThumb(Array(10).fill(100), 400, false)).toBe(32);
    expect(fitThumb(Array(200).fill(100), 400, false)).toBe(16);
  });

  it('steps through the five sizes', () => {
    expect(stepZoom(48, 1)).toBe(64);
    expect(stepZoom(48, -1)).toBe(32);
    expect(stepZoom(96, 1)).toBe(96);
    expect(stepZoom(24, -1)).toBe(24);
    expect(stepZoom(40, 1)).toBe(48);
  });
});

describe('K1 durations on the strip', { tags: ['critical'] }, () => {
  it('snaps to 10 ms or whole ticks and goes free with Shift', () => {
    expect(snapDuration(97, 'ms', false)).toBe(100);
    expect(snapDuration(4, 'ms', false)).toBe(10);
    expect(snapDuration(97, 'ms', true)).toBe(97);
    expect(snapDuration(100, 'ticks', false)).toBe(83);
    expect(snapDuration(130, 'ticks', false)).toBe(167);
  });

  it('writes a duration and a clock in the chosen units', () => {
    expect(formatDuration(1200, 'ms')).toBe('1200');
    expect(formatDuration(1200, 'seconds')).toBe('1.2');
    expect(formatDuration(500, 'ticks')).toBe('6t');
    expect(formatClock(300, 1200, 'seconds')).toBe('0.30 / 1.20 s');
  });

  it('previews a dragged edge and a scaled pick', () => {
    const frames = [
      { id: 'a' as never, durationMs: 100 },
      { id: 'b' as never, durationMs: 200 },
    ];
    expect(draftedDurations(frames, { ids: ['a' as never], lead: 'a' as never, ms: 130, factor: 1 })).toEqual([130, 200]);
    expect(draftedDurations(frames, { ids: ['a' as never, 'b' as never], lead: 'a' as never, ms: 150, factor: 1.5 })).toEqual([150, 300]);
    expect(draftedDurations(frames, null)).toEqual([100, 200]);
  });
});

describe('K1 the saved animation settings', { tags: ['critical'] }, () => {
  it('round trip through the store', () => {
    const onion = { ...ONION_DEFAULTS, on: true, before: 6, after: 3, falloff: 'flat' as const, style: 'outline' as const, wrap: false, position: 'front' as const };
    const written = writeAnimationSettings({ onion, playMode: 'pingpong', subtags: true, rewind: false, speed: 0.5 });
    expect(readOnion(written)).toEqual(onion);
    expect(readPlay(written)).toEqual({ playMode: 'pingpong', subtags: true, rewind: false, speed: 0.5 });
    expect(readZoom({ ...written, animThumb: 64 })).toBe(64);
    expect(readSavedView({ zooms: { a: 64 }, timeMode: true, units: 'ticks' })).toEqual({ zooms: { a: 64 }, timeMode: true, units: 'ticks' });
  });

  it('clamp or drop a value that is not valid', () => {
    expect(readOnion({ animOnionBefore: 99, animOnionOpacity: 1, animOnionTint: 'rainbow', animOnionBeforeColour: 'red' })).toMatchObject({
      before: 8,
      opacity: 5,
      tint: ONION_DEFAULTS.tint,
      beforeColour: ONION_DEFAULTS.beforeColour,
    });
    expect(readPlay({ animSpeed: 3 }).speed).toBe(1);
    expect(readZoom({ animThumb: 500 })).toBe(96);
    expect(readSavedView({ zooms: { a: 64, b: 'x', c: 4 }, units: 'years' })).toEqual({ zooms: { a: 64, c: 16 }, timeMode: false, units: 'ms' });
  });
});
