/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { timelineKeyAction } from '../../src/views/TimelinePanel/behavior/timeline-key-action';
import type { TimelineKeyInfo } from '../../src/views/TimelinePanel/TimelinePanel.type';

const key = (name: string, held: Partial<TimelineKeyInfo> = {}): TimelineKeyInfo => ({
  key: name,
  shiftKey: false,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  ...held,
});

describe('the keys of the timeline', () => {
  it('step with comma and period and pick the neighbour with the arrows', () => {
    expect(timelineKeyAction(key(','))).toEqual({ kind: 'step', delta: -1, extend: false });
    expect(timelineKeyAction(key('.'))).toEqual({ kind: 'step', delta: 1, extend: false });
    expect(timelineKeyAction(key('ArrowRight'))).toEqual({ kind: 'step', delta: 1, extend: false });
    expect(timelineKeyAction(key('ArrowLeft', { shiftKey: true }))).toEqual({ kind: 'step', delta: -1, extend: true });
  });

  it('jump to the ends with Home and End', () => {
    expect(timelineKeyAction(key('Home'))).toEqual({ kind: 'edge', end: 'first', extend: false });
    expect(timelineKeyAction(key('End', { shiftKey: true }))).toEqual({ kind: 'edge', end: 'last', extend: true });
  });

  it('move the picked frames with Alt and the side arrows only', () => {
    expect(timelineKeyAction(key('ArrowRight', { altKey: true }))).toEqual({ kind: 'move', delta: 1 });
    expect(timelineKeyAction(key('ArrowLeft', { altKey: true }))).toEqual({ kind: 'move', delta: -1 });
    expect(timelineKeyAction(key('ArrowUp', { altKey: true }))).toBeNull();
    expect(timelineKeyAction(key(',', { altKey: true }))).toBeNull();
  });

  it('leave the shortcuts with Control and Command to the app', () => {
    expect(timelineKeyAction(key('ArrowRight', { ctrlKey: true }))).toBeNull();
    expect(timelineKeyAction(key('.', { metaKey: true }))).toBeNull();
    expect(timelineKeyAction(key('a'))).toBeNull();
  });
});
