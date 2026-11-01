/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { entryAsset } from '../../src/asset-drag/entry-asset';
import { assetEntries } from '../../src/sheet-manager/asset-entries';

describe('K1 the typed drag payload of the Sheet widget', { tags: ['critical'] }, () => {
  it('carries a sprite and a tagged strip to the drop targets and back as entries', () => {
    const sprite = entryAsset({ kind: 'sprite', assetId: 's1', path: 'sprites/a.bxsprite' }, 'sheet');
    const strip = entryAsset({ kind: 'animation', assetId: 'a1', path: 'animations/walk.bxanim', tagId: 't1' }, 'library');
    expect(sprite).toMatchObject({ id: 's1', origin: 'sheet', tagId: null });
    expect(strip).toMatchObject({ id: 'a1:t1', origin: 'library', tagId: 't1' });
    expect(assetEntries([sprite, strip])).toEqual([
      { kind: 'sprite', assetId: 's1', path: 'sprites/a.bxsprite', tagId: null },
      { kind: 'animation', assetId: 'a1', path: 'animations/walk.bxanim', tagId: 't1' },
    ]);
  });
});
