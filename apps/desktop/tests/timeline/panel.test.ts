/* @layer renderer-app @kind test */
import * as React from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { PIXEL_ICONS } from '../../src/icons/pixel-icon.constants';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addTag } from '../../src/timeline/add-tag';
import { linkCels } from '../../src/timeline/link-cels';
import { timelineModel } from '../../src/timeline/timeline-model';
import { TimelinePanel } from '../../src/views/TimelinePanel';
import { CEL_ACTIONS, FRAME_ACTIONS } from '../../src/views/TimelinePanel/TimelinePanel.constants';
import { ActionBar } from '../../src/views/TimelinePanel/sub-components/ActionBar';
import { DurationField } from '../../src/views/TimelinePanel/sub-components/DurationField';
import { OnionControls } from '../../src/views/TimelinePanel/sub-components/OnionControls';
import { OnionToggle } from '../../src/views/TimelinePanel/sub-components/OnionToggle';
import { TagEditor } from '../../src/views/TimelinePanel/sub-components/TagEditor';
import { TimelineGrid } from '../../src/views/TimelinePanel/sub-components/TimelineGrid';
import { TransportBar } from '../../src/views/TimelinePanel/sub-components/TransportBar';
import { frameAt, freshDocument, live, paintCel, pickCels, pickRange, withFrames } from './timeline-harness';

Object.assign(globalThis, { React });

beforeEach(freshDocument);

const NEW_ICONS = [
  'play',
  'pause',
  'loop',
  'pingPong',
  'framePrev',
  'frameNext',
  'onionSkin',
  'frameAdd',
  'frameDuplicate',
  'frameDelete',
  'tagAdd',
  'linkedCel',
  'unlinkCel',
] as const;

const gridHtml = (): string => {
  const { selection, tagId } = useTimelineStore.getState();
  const target = live();
  return renderToString(createElement(TimelineGrid, { model: timelineModel(target, selection, tagId), frameId: target.frameId }));
};

describe('timeline icons', () => {
  it('draws every timeline icon on the sixteen by sixteen grid', () => {
    for (const name of NEW_ICONS) {
      const bitmap = PIXEL_ICONS[name];
      expect(bitmap, name).toHaveLength(16);
      expect(bitmap.every((row) => row.length === 16 && /^[.#+]+$/.test(row)), name).toBe(true);
      expect(bitmap.some((row) => /[#+]/.test(row)), name).toBe(true);
    }
  });
});

describe('the timeline grid', () => {
  it('names the grid, the frames and each cel by layer, frame and state', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    const html = gridHtml();
    expect(html).toContain('role="grid"');
    expect(html).toContain('aria-label="Frames and layers"');
    expect(html).toContain('aria-label="Frame 1, 100 milliseconds"');
    expect(html).toContain('aria-label="Layer 1, frame 1, filled"');
    expect(html).toContain('aria-label="Layer 1, frame 2, empty"');
  });

  it('marks linked cels and keeps one cel in the tab order', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 2 });
    linkCels();
    const html = gridHtml();
    expect(html.match(/data-state="linked"/g)).toHaveLength(3);
    expect(html.match(/data-cel-current="yes"/g)).toHaveLength(1);
    expect(html.match(/aria-label="Layer 1, frame \d, [a-z]+"[^>]*tabindex="0"|tabindex="0"[^>]*aria-label="Layer 1, frame \d, [a-z]+"/g)).toHaveLength(1);
  });

  it('marks the picked frames and the frame the playhead is on', () => {
    withFrames(4);
    pickRange(1, 2);
    const html = gridHtml();
    expect(html.match(/data-selected="yes"/g)?.length).toBeGreaterThanOrEqual(2);
    expect(html).toContain(`data-reorder-key="${frameAt(1)}"`);
    expect(html.match(/class="timeline-head"[^>]*data-current="yes"/g)).toHaveLength(1);
  });

  it('draws a tag over its frames with the name on the first', () => {
    withFrames(4);
    pickRange(1, 2);
    addTag();
    const html = gridHtml();
    expect(html.match(/class="pressable timeline-tag"/g)).toHaveLength(2);
    expect(html).toContain('data-edge="start"');
    expect(html).toContain('data-edge="end"');
    expect(html).toContain('Tag 1');
  });
});

describe('the timeline bars', () => {
  it('offers playback, loop and ping-pong by name', () => {
    const html = renderToString(createElement(TransportBar));
    for (const label of ['Previous frame', 'Play', 'Next frame', 'Loop playback', 'Ping-pong playback']) {
      expect(html).toContain(`aria-label="${label}"`);
    }
  });

  it('offers the frame and cel actions by name', () => {
    const frames = renderToString(createElement(ActionBar, { label: 'Frame actions', actions: FRAME_ACTIONS }));
    for (const label of ['Add frame', 'Duplicate frames', 'Delete frames', 'Add tag on the selected frames']) {
      expect(frames).toContain(`aria-label="${label}"`);
    }
    const cels = renderToString(createElement(ActionBar, { label: 'Cel actions', actions: CEL_ACTIONS }));
    for (const label of ['Link cels across the selected frames', 'Unlink cels', 'Clear cels (Delete)']) {
      expect(cels).toContain(`aria-label="${label}"`);
    }
  });

  it('offers the onion skin switch and its settings by name', () => {
    expect(renderToString(createElement(OnionToggle))).toContain('aria-label="Onion skin"');
    const html = renderToString(createElement(OnionControls));
    for (const label of ['Frames before', 'Frames after', 'Onion opacity', 'Onion tint']) expect(html).toContain(`aria-label="${label}"`);
  });

  it('shows the duration of the frame with its unit', () => {
    const html = renderToString(createElement(DurationField, { value: 120, onCommit: () => true }));
    expect(html).toContain('value="120"');
    expect(html).toContain('aria-label="Frame duration in milliseconds, applied to the selected frames"');
  });

  it('edits a tag by name, loop mode and range', () => {
    withFrames(3);
    pickRange(0, 1);
    addTag();
    const tag = live().sprite.tags[0];
    if (!tag) throw new Error('no tag');
    const html = renderToString(createElement(TagEditor, { tag }));
    expect(html).toContain('aria-label="Tag name"');
    expect(html).toContain(`value="${tag.name}"`);
    for (const label of ['Forward', 'Reverse', 'Ping-pong', 'Set range to selected frames']) expect(html).toContain(label);
  });

  it('shows the empty state while no sprite is open', () => {
    expect(renderToString(createElement(TimelinePanel))).toContain('No sprite is open.');
  });
});
