/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { VisibleRow } from '../../src/panel-browser/project-browser.type';
import type { DropData } from '../../src/views/ProjectPanel/sub-components/ProjectGrid/ProjectGrid.type';
import { sectionsOf } from '../../src/views/ProjectPanel/sub-components/ProjectGrid/behavior/sections-of';
import { ROOT, treeOf } from './browser-fixture';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const rowOf = (path: string, expanded: boolean | null): VisibleRow => {
  const item = treeOf().items.get(path);
  if (item === undefined) throw new Error(`no item at ${path}`);
  return { item, depth: 1, posinset: 1, setsize: 1, expanded, ...(expanded === null ? {} : { count: 1 }) };
};

const filesData = (types: readonly string[], files: readonly File[] = []): DropData => ({ types, files });

describe('S2 the project grid sections', { tags: ['standard'] }, () => {
  it('lets a folder section take native files and hands them to the folder', () => {
    const received: string[] = [];
    const sections = sectionsOf([rowOf(`${ROOT}/sprites`, true), rowOf(`${ROOT}/sprites/hero.bxsprite`, null)], (folder, files) => received.push(`${folder.path}:${files.length}`));
    const section = sections[0];
    expect(section?.accepts?.(filesData(['Files']))).toBe(true);
    expect(section?.accepts?.(filesData(['text/plain']))).toBe(false);
    section?.onDropData?.(filesData(['Files'], [new File(['x'], 'a.png')]));
    expect(received).toEqual([`${ROOT}/sprites:1`]);
  });

  it('gives a section no file drop without a handler', () => {
    const sections = sectionsOf([rowOf(`${ROOT}/sprites`, true)]);
    expect(sections[0]?.onDropData).toBeUndefined();
  });
});
