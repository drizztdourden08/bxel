/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { splitControls } from '../../src/views/EditorCanvas/behavior/split-controls';
import type { SplitFollow } from '../../src/views/EditorCanvas/behavior/split-view.type';
import { mountView } from './view-fixture';

vi.mock('react', async (importOriginal) => ({ ...(await importOriginal<Record<string, unknown>>()), ...(await import('./hook-harness')).hooks }));

const follow: SplitFollow = { shared: { zoom: 8, pan: { x: 5, y: 6 } }, onZoom: () => undefined, onPan: () => undefined };

describe('K1 split view controls', { tags: ['critical'] }, () => {
  it('leaves both panes alone when the view is not split', () => {
    const controls = splitControls({ split: false, link: true, actual: true }, follow);
    expect(controls.first).toEqual({});
    expect(controls.second).toEqual({});
  });

  it('lets each pane keep its own zoom and pan when nothing is linked', () => {
    const controls = splitControls({ split: true, link: false, actual: false }, follow);
    expect(controls.first).toEqual({});
    expect(controls.second).toEqual({});
  });

  it('gives both linked panes the same zoom and pan', () => {
    const controls = splitControls({ split: true, link: true, actual: false }, follow);
    expect(controls.first.zoom).toBe(8);
    expect(controls.second.zoom).toBe(8);
    expect(controls.first.pan).toEqual({ x: 5, y: 6 });
    expect(controls.second.pan).toEqual({ x: 5, y: 6 });
    expect(controls.second.onZoomChange).toBe(follow.onZoom);
  });

  it('holds the second pane at actual size and links only the pan', () => {
    const controls = splitControls({ split: true, link: true, actual: true }, follow);
    expect(controls.second.zoom).toBe(1);
    expect(controls.second.zoomLocked).toBe(true);
    expect(controls.second.pan).toEqual({ x: 5, y: 6 });
    expect(controls.first.zoom).toBeUndefined();
    expect(controls.first.onZoomChange).toBeUndefined();
    expect(controls.first.pan).toEqual({ x: 5, y: 6 });
  });
});

describe('K1 actual size pane', { tags: ['critical'] }, () => {
  it('ignores zoom commands and the wheel while locked', () => {
    const view = mountView({ zoom: 1, zoomLocked: true });
    view.act((state) => state.zoomStep(1));
    view.act((state) => state.zoomTo(8));
    expect(view.current.target.zoom).toBe(1);
  });

  it('still pans while locked and keeps the zoom', () => {
    const onPanChange = vi.fn();
    const view = mountView({ image: { width: 2000, height: 1500 }, zoom: 1, zoomLocked: true, onPanChange });
    view.act((state) => state.panBy(4, 0));
    expect(view.current.target.zoom).toBe(1);
    expect(onPanChange).toHaveBeenCalled();
  });
});
