/* @layer renderer-app @kind test */
import * as React from 'react';
import { createToolbarLayout, hideToolbar, isToolbarShown, migrateToolbarLayout, moveToolbar, showToolbar } from '@drizztdourden08/tessera';
import { describe, expect, it, vi } from 'vitest';

Object.assign(globalThis, { React });

vi.mock('@drizztdourden08/brock-react', async () => {
  const base = (await import('../keymap/brock-react-mock')).brockReactMock();
  return { ...base, defineToolbar: (toolbar: unknown) => toolbar, useCommandChords: () => [], useIsMac: () => false, chordKeys: () => [] };
});

const [canvas, options, tools] = await Promise.all([
  import('../../src/toolbars/canvas.toolbar'),
  import('../../src/toolbars/options.toolbar'),
  import('../../src/toolbars/tools.toolbar'),
]);

const defs = [canvas.default, options.default, tools.default];

describe('the toolbar definitions', () => {
  it('name three toolbars with unique ids', () => {
    expect(defs.map((def) => def.id)).toEqual(['canvas', 'options', 'tools']);
    expect(new Set(defs.map((def) => def.id)).size).toBe(defs.length);
  });

  it('start the canvas and option toolbars on top and the tools on the left', () => {
    expect(defs.map((def) => def.defaultSide)).toEqual(['top', 'top', 'left']);
  });

  it('show every toolbar from the start and give each a label', () => {
    for (const def of defs) {
      expect(def.hiddenByDefault).toBeUndefined();
      expect(def.label.trim()).not.toBe('');
    }
  });
});

const saved = (value: unknown): unknown => JSON.parse(JSON.stringify(value));

describe('the saved toolbar layout', () => {
  it('stacks the canvas toolbar over the option toolbar on top and puts the tools on the left', () => {
    const layout = createToolbarLayout(defs);
    expect(layout.sides.top).toEqual(['canvas', 'options']);
    expect(layout.sides.left).toEqual(['tools']);
    expect(layout.sides.bottom).toEqual([]);
    expect(layout.sides.right).toEqual([]);
    expect(layout.hidden).toEqual([]);
  });

  it('restores a moved toolbar after a round trip through JSON', () => {
    const moved = moveToolbar(createToolbarLayout(defs), 'tools', 'right', 0);
    const restored = migrateToolbarLayout(saved(moved), defs);
    expect(restored).toEqual(moved);
    expect(restored.sides.right).toEqual(['tools']);
    expect(restored.sides.left).toEqual([]);
  });

  it('keeps at most two toolbars on a side', () => {
    const layout = createToolbarLayout(defs);
    expect(moveToolbar(layout, 'tools', 'top', 0)).toBe(layout);
  });

  it('keeps a removed toolbar hidden after a round trip and shows it again where it was', () => {
    const start = createToolbarLayout(defs);
    const removed = hideToolbar(start, 'options');
    const restored = migrateToolbarLayout(saved(removed), defs);
    expect(isToolbarShown(restored, 'options')).toBe(false);
    expect(restored.hidden).toEqual(['options']);
    expect(showToolbar(restored, 'options', defs).sides.top).toEqual(['canvas', 'options']);
  });

  it('places a toolbar that the saved layout does not know on its default side', () => {
    const older = createToolbarLayout(defs.filter((def) => def.id !== 'options'));
    const restored = migrateToolbarLayout(saved(older), defs);
    expect(restored.sides.top).toContain('options');
    expect(restored.sides.top).toContain('canvas');
  });

  it('drops a toolbar that no longer exists and starts again from the defaults on a broken value', () => {
    const withOld = migrateToolbarLayout(saved({ ...createToolbarLayout(defs), hidden: ['gone'] }), defs);
    expect(withOld.hidden).toEqual([]);
    expect(migrateToolbarLayout('broken', defs)).toEqual(createToolbarLayout(defs));
  });
});
