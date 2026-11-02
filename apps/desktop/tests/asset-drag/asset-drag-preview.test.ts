/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { assetDragPreview, labelOf } from '../../src/asset-drag/asset-drag-preview';
import type { DragAsset } from '../../src/asset-drag/asset-drag.type';

const asset = (path: string): DragAsset => ({ id: path, kind: 'sprite', assetId: null, path });

describe('asset drag preview', () => {
  it('names a single asset by its file name', () => {
    expect(labelOf([asset('art/hero.bxel')])).toBe('hero.bxel');
  });

  it('labels several assets by how many are dragged', () => {
    expect(labelOf([asset('a.bxel'), asset('b.bxel'), asset('c.bxel')])).toBe('3 entries');
  });

  it('gives the ghost the count of dragged assets', () => {
    const count = assetDragPreview.count;
    expect(typeof count === 'function' ? count([asset('a.bxel'), asset('b.bxel')]) : count).toBe(2);
    expect(typeof count === 'function' ? count([asset('a.bxel')]) : count).toBeUndefined();
  });
});
