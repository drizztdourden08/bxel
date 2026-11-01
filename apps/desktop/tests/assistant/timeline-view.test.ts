/* @layer renderer-app @kind test */
import { PRESETS } from '@bxel/mcp';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addTag } from '../../src/timeline/add-tag';
import { animationOf, frameAt, pickRange, withFrames } from '../timeline/timeline-harness';
import { check } from './app-tools-check';
import { openDocument, reset } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok, code } = check;

type TimelineView = {
  animationId: string | null;
  frameId: string | null;
  pickedFrameIds: string[];
  range: { kind: string; tagId?: string; from?: string; to?: string };
  playing: boolean;
  playMode: string;
  speed: number;
  zoom: number | string;
  timeMode: boolean;
  units: string;
  onion: Record<string, unknown>;
};

const timelineNow = async (): Promise<TimelineView> => (await ok('get_view', {})).timeline as TimelineView;

beforeEach(() => {
  reset();
  withFrames(4);
});

describe('S2 get_view timeline', { tags: ['standard'] }, () => {
  it('reports the animation, the playhead, the pick, the range and the defaults', async () => {
    const seen = await timelineNow();
    expect(seen).toMatchObject({
      animationId: animationOf().id,
      frameId: frameAt(0),
      pickedFrameIds: [frameAt(0)],
      range: { kind: 'whole' },
      playing: false,
      playMode: 'loop',
      speed: 1,
      timeMode: false,
      units: 'ms',
      onion: { on: false, before: 1, after: 1, wrap: true, scope: 'range', position: 'behind', hideWhilePlaying: true },
    });
    expect(typeof seen.zoom).toBe('number');
  });

  it('has no animation, playhead or pick on a sprite tab', async () => {
    reset();
    openDocument();
    expect(await timelineNow()).toMatchObject({ animationId: null, frameId: null, pickedFrameIds: [], range: { kind: 'whole' } });
  });

  it('keeps the old playback block, with loop following the play mode', async () => {
    useTimelineStore.getState().setPlayMode('once');
    const seen = await ok('get_view', {});
    expect(seen.playback).toMatchObject({ loop: false, frame: frameAt(0) });
  });
});

describe('S2 set_view timeline', { tags: ['standard'] }, () => {
  it('sets the onion to two before and two after with wrap, and reads it back', async () => {
    const done = await ok('set_view', { timeline: { onion: { on: true, before: 2, after: 2, wrap: true, tint: 'grey', style: 'outline' } } });
    expect(done.applied).toEqual(['timeline']);
    expect(useTimelineStore.getState().onion).toMatchObject({ on: true, before: 2, after: 2, wrap: true, tint: 'grey', style: 'outline' });
    expect((await timelineNow()).onion).toMatchObject({ on: true, before: 2, after: 2, wrap: true });
  });

  it('moves the playhead and leaves the pick where it was', async () => {
    await ok('set_view', { timeline: { frameId: frameAt(2) } });
    expect(await timelineNow()).toMatchObject({ frameId: frameAt(2), pickedFrameIds: [frameAt(0)] });
  });

  it('picks frames in strip order, with the range picked, and clears the pick', async () => {
    await ok('set_view', { timeline: { pickedFrameIds: [frameAt(3), frameAt(1)], range: { kind: 'picked' }, frameId: frameAt(1) } });
    expect(await timelineNow()).toMatchObject({ frameId: frameAt(1), pickedFrameIds: [frameAt(1), frameAt(3)], range: { kind: 'picked' } });
    await ok('set_view', { timeline: { pickedFrameIds: [] } });
    expect((await timelineNow()).pickedFrameIds).toEqual([frameAt(1)]);
  });

  it('sets a loop range, a tag range and then the whole animation again', async () => {
    await ok('set_view', { timeline: { range: { kind: 'loop', from: frameAt(1), to: frameAt(2) } } });
    expect((await timelineNow()).range).toEqual({ kind: 'loop', from: frameAt(1), to: frameAt(2) });
    pickRange(1, 2);
    addTag();
    const tagId = animationOf().tags.at(-1)?.id ?? '';
    await ok('set_view', { timeline: { range: { kind: 'whole' } } });
    await ok('set_view', { timeline: { range: { kind: 'tag', tagId } } });
    expect(await timelineNow()).toMatchObject({ range: { kind: 'tag', tagId }, pickedFrameIds: [frameAt(1), frameAt(2)] });
    await ok('set_view', { timeline: { range: { kind: 'whole' } } });
    expect((await timelineNow()).range).toEqual({ kind: 'whole' });
  });

  it('sets the play mode, speed, zoom, time mode and units, and fits', async () => {
    await ok('set_view', { timeline: { playMode: 'pingpong', speed: 0.5, zoom: 64, timeMode: true, units: 'ticks' } });
    expect(await timelineNow()).toMatchObject({ playMode: 'pingpong', speed: 0.5, zoom: 64, timeMode: true, units: 'ticks' });
    await ok('set_view', { timeline: { zoom: 'fit' } });
    expect((await timelineNow()).zoom).toBe('fit');
  });

  it('plays and pauses', async () => {
    await ok('set_view', { timeline: { playing: true } });
    expect((await timelineNow()).playing).toBe(true);
    await ok('set_view', { timeline: { playing: false } });
    expect((await timelineNow()).playing).toBe(false);
  });

  it('refuses a frame or a tag that is not in the open animation, and changes nothing', async () => {
    expect(await code('set_view', { timeline: { frameId: 'afr_4k9m2q7x1v8c' } })).toBe('VIEW_INVALID');
    expect(await code('set_view', { timeline: { range: { kind: 'tag', tagId: 'tag_4k9m2q7x1v8c' } } })).toBe('VIEW_INVALID');
    expect(await code('set_view', { timeline: { pickedFrameIds: [frameAt(1), 'afr_4k9m2q7x1v8c'] } })).toBe('VIEW_INVALID');
    expect(await timelineNow()).toMatchObject({ frameId: frameAt(0), pickedFrameIds: [frameAt(0)], range: { kind: 'whole' } });
  });

  it('needs an animation tab for the playhead, the pick and the range, not for the onion', async () => {
    reset();
    openDocument();
    expect(await code('set_view', { timeline: { frameId: 'afr_4k9m2q7x1v8c' } })).toBe('VIEW_INVALID');
    expect(await code('set_view', { timeline: { onion: { on: true } } })).toBe('OK');
    expect(useTimelineStore.getState().onion.on).toBe(true);
  });

  it('is a show effect that a Read level program may use', async () => {
    expect(await code('set_view', { timeline: { frameId: frameAt(1), onion: { on: true, before: 2, after: 2 } } }, PRESETS.read_only.grant)).toBe('OK');
    expect((await timelineNow()).frameId).toBe(frameAt(1));
  });
});
