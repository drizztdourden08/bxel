/* @layer renderer-app @kind test */
import type { DocumentEntry } from '@drizztdourden08/brock-core';
import { describe, expect, it } from 'vitest';
import { listRootEntries } from '../../src/asset-list/list-root-entries';

const entry = (path: string, kind: DocumentEntry['kind']): DocumentEntry => ({ path, name: path.split('/').pop() ?? path, kind, size: 0, modified: 0, link: false });

const tree: Readonly<Record<string, readonly DocumentEntry[]>> = {
  '/p': [entry('/p/a', 'folder'), entry('/p/top.bxel', 'file')],
  '/p/a': [entry('/p/a/deep.bxel', 'file')],
};

describe('listRootEntries', { tags: ['standard'] }, () => {
  it('keeps the recursive listing when it is complete', async () => {
    const list = () => Promise.resolve({ entries: [entry('/p/x.bxel', 'file')], truncated: false });
    expect((await listRootEntries({ list }, '/p')).map((each) => each.path)).toEqual(['/p/x.bxel']);
  });

  it('walks folder by folder when the recursive listing was cut', async () => {
    const list = (folder: string, options?: { recursive?: boolean }) => Promise.resolve({ entries: [...(options?.recursive ? [] : (tree[folder] ?? []))], truncated: options?.recursive === true });
    const found = await listRootEntries({ list }, '/p');
    expect(found.map((each) => each.path)).toEqual(['/p/a', '/p/top.bxel', '/p/a/deep.bxel']);
  });
});
