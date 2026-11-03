/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { LayerRowKind, LayerRowModel } from '../../src/views/LayerStack/LayerStack.type';
import { stripMixed } from '../../src/views/LayerStack/behavior/strip-mixed';

const row = (id: string, kind: LayerRowKind, patch: Partial<LayerRowModel> = {}): LayerRowModel => ({
  id,
  name: id,
  visible: true,
  mixedVisible: false,
  lock: 'none',
  mixedLock: false,
  colour: null,
  note: null,
  thumb: null,
  kind,
  depth: 0,
  parentId: null,
  childCount: 0,
  viewOpacity: 100,
  clip: false,
  exported: true,
  missing: false,
  ...patch,
});

describe('layer strip mixed state', { tags: ['critical'] }, () => {
  it('is not mixed for one layer or for layers that agree', () => {
    expect(stripMixed([row('a', 'pixel')])).toEqual({ lock: false, opacity: false, clip: false, exported: false });
    expect(stripMixed([row('a', 'pixel'), row('b', 'pixel')])).toEqual({ lock: false, opacity: false, clip: false, exported: false });
  });

  it('marks each field that differs across the pick', () => {
    const picked = [row('a', 'pixel'), row('b', 'pixel', { lock: 'pixels', viewOpacity: 50, clip: true, exported: false })];
    expect(stripMixed(picked)).toEqual({ lock: true, opacity: true, clip: true, exported: true });
  });

  it('leaves clip to pixel layers and export to layers that export', () => {
    const picked = [row('a', 'pixel', { clip: true }), row('b', 'reference', { clip: false, exported: false }), row('c', 'group', { clip: false })];
    expect(stripMixed(picked)).toMatchObject({ clip: false, exported: false });
  });
});
