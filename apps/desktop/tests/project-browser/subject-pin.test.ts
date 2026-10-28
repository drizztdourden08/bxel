/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { useSubjectStore } from '../../src/properties-subject/useSubjectStore';

const ref = (path: string) => ({ path, key: null });

describe('the pin of the Properties window', () => {
  beforeEach(() => useSubjectStore.getState().restore(null));

  it('follows the tab until a file is pinned, and follows again when unpinned', () => {
    expect(useSubjectStore.getState().pin).toBeNull();
    useSubjectStore.getState().pinTo(ref('/p/hero.bxsprite'));
    expect(useSubjectStore.getState().pin?.path).toBe('/p/hero.bxsprite');
    useSubjectStore.getState().unpin();
    expect(useSubjectStore.getState().pin).toBeNull();
  });

  it('goes back and forward through the files it was pinned to', () => {
    const store = useSubjectStore.getState();
    store.pinTo(ref('/p/a.bxsprite'));
    useSubjectStore.getState().pinTo(ref('/p/b.bxsprite'));
    useSubjectStore.getState().pinTo(ref('/p/c.bxsprite'));
    useSubjectStore.getState().back();
    expect(useSubjectStore.getState().pin?.path).toBe('/p/b.bxsprite');
    useSubjectStore.getState().back();
    expect(useSubjectStore.getState().pin?.path).toBe('/p/a.bxsprite');
    useSubjectStore.getState().forward();
    expect(useSubjectStore.getState().pin?.path).toBe('/p/b.bxsprite');
  });

  it('does not add the same file to the history twice', () => {
    useSubjectStore.getState().pinTo(ref('/p/a.bxsprite'));
    useSubjectStore.getState().pinTo(ref('/P/A.bxsprite'));
    expect(useSubjectStore.getState().past).toHaveLength(0);
  });
});
