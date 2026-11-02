/* @layer renderer-app @kind test */
import { useNavigationStore } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it } from 'vitest';
import { readPin } from '../../src/properties-subject/read-pin';
import { refToParams } from '../../src/properties-subject/ref-to-params';
import { paramsToRef } from '../../src/properties-subject/subject-params';
import { useSubjectStore } from '../../src/properties-subject/useSubjectStore';

const ref = (path: string) => ({ path, key: null });

describe('K1 the pin of the Properties window', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useNavigationStore.getState().restore(null);
    useSubjectStore.setState({ past: [], future: [] });
  });

  it('follows the tab until a file is pinned, and follows again when unpinned', () => {
    expect(readPin()).toBeNull();
    useSubjectStore.getState().pinTo(ref('/p/hero.bxsprite'));
    expect(readPin()?.path).toBe('/p/hero.bxsprite');
    useSubjectStore.getState().unpin();
    expect(readPin()).toBeNull();
  });

  it('goes back and forward through the files it was pinned to', () => {
    useSubjectStore.getState().pinTo(ref('/p/a.bxsprite'));
    useSubjectStore.getState().pinTo(ref('/p/b.bxsprite'));
    useSubjectStore.getState().pinTo(ref('/p/c.bxsprite'));
    useSubjectStore.getState().back();
    expect(readPin()?.path).toBe('/p/b.bxsprite');
    useSubjectStore.getState().back();
    expect(readPin()?.path).toBe('/p/a.bxsprite');
    useSubjectStore.getState().forward();
    expect(readPin()?.path).toBe('/p/b.bxsprite');
  });

  it('does not add the same file to the history twice', () => {
    useSubjectStore.getState().pinTo(ref('/p/a.bxsprite'));
    useSubjectStore.getState().pinTo(ref('/P/A.bxsprite'));
    expect(useSubjectStore.getState().past).toHaveLength(0);
  });

  it('keeps the pin in the route params of the Properties window', () => {
    useSubjectStore.getState().pinTo(ref('/p/hero.bxsprite'));
    expect(useNavigationStore.getState().remembered.properties).toMatchObject({ subject: '/p/hero.bxsprite', pin: '1' });
  });

  it('writes a file with no path as an asset key and reads it back', () => {
    const params = refToParams({ path: null, key: { kind: 'sprite', id: 'a:b' } });
    expect(paramsToRef(params)).toEqual({ path: null, key: { kind: 'sprite', id: 'a:b' } });
  });

  it('reads no pin when the pin flag is off', () => {
    expect(paramsToRef({ subject: '/p/hero.bxsprite' })).toBeNull();
    expect(paramsToRef(refToParams(null))).toBeNull();
  });
});
