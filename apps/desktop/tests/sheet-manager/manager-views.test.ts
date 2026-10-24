/* @layer renderer-app @kind test */
import type { SpriteId } from '@bxel/document';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_SAVED_VIEWS, SAVE_DELAY_MS } from '../../src/manager-views/manager-views.constants';
import type { ManagerViews } from '../../src/manager-views/manager-views.type';
import { readViews } from '../../src/manager-views/read-views';
import { viewBook } from '../../src/manager-views/view-book';
import { MANAGER_DEFAULTS } from '../../src/stores/manager-store.constants';
import { useManagerStore } from '../../src/stores/useManagerStore';

const store = () => useManagerStore.getState();

const saved: ManagerViews[] = [];

const lastSaved = (): ManagerViews => {
  const found = saved.at(-1);
  if (!found) throw new Error('nothing was saved');
  return found;
};

const gone = (views: ManagerViews): unknown => JSON.parse(JSON.stringify(views));

beforeEach(() => {
  vi.useFakeTimers();
  saved.length = 0;
  viewBook.reset();
  useManagerStore.setState({ ...MANAGER_DEFAULTS });
  viewBook.connect((views) => saved.push(views));
});

afterEach(() => {
  viewBook.reset();
  vi.useRealTimers();
});

describe('reading the saved views', () => {
  it('fills every missing field with its default and drops what is not a view', () => {
    const views = readViews({ sht_a: { zoom: 64, sortKey: 'name' }, sht_b: 'broken', sht_c: null });
    expect(Object.keys(views)).toEqual(['sht_a']);
    expect(views['sht_a']).toMatchObject({ zoom: 64, sortKey: 'name', view: 'grid', tab: 'sprites', collapsed: [], selections: [] });
    expect(views['sht_a']?.atlas).toEqual(MANAGER_DEFAULTS.atlas);
    expect(views['sht_a']?.filter).toEqual(MANAGER_DEFAULTS.filter);
  });

  it('keeps a file from before the rotation setting and falls back from values that are out of range', () => {
    const { rotate: _rotate, ...older } = MANAGER_DEFAULTS.atlas;
    const views = readViews({ sht_a: { atlas: older, zoom: 9999, sortKey: 'nonsense', view: 'tiles', filter: { identical: 'maybe', tag: 4 } } });
    expect(views['sht_a']?.atlas.rotate).toBe(false);
    expect(views['sht_a']).toMatchObject({ zoom: MANAGER_DEFAULTS.zoom, sortKey: 'manual', view: 'grid' });
    expect(views['sht_a']?.filter).toMatchObject({ identical: 'off', tag: null });
  });

  it('ignores a value that is not a record and keeps only the newest views', () => {
    expect(readViews(undefined)).toEqual({});
    expect(readViews([1, 2])).toEqual({});
    const many = Object.fromEntries(Array.from({ length: MAX_SAVED_VIEWS + 5 }, (_unused, at) => [`sht_${at}`, {}]));
    const kept = Object.keys(readViews(many));
    expect(kept).toHaveLength(MAX_SAVED_VIEWS);
    expect(kept.at(-1)).toBe(`sht_${MAX_SAVED_VIEWS + 4}`);
  });
});

describe('the view of each sheet', () => {
  it('keeps the view, zoom, sort, filters and saved selections apart for each sheet', () => {
    viewBook.attach('sht_a', undefined);
    store().patch({ view: 'list', zoom: 80, sortKey: 'area', sortDown: true, tab: 'atlas' });
    store().patchFilter({ animated: true, tag: 'walk' });
    store().saveSelection({ name: 'walkers', ids: ['spr_1' as SpriteId] });
    viewBook.attach('sht_b', undefined);
    expect(store()).toMatchObject({ view: 'grid', zoom: MANAGER_DEFAULTS.zoom, sortKey: 'manual', tab: 'sprites', selections: [] });
    store().patch({ zoom: 32 });
    viewBook.attach('sht_a', undefined);
    expect(store()).toMatchObject({ view: 'list', zoom: 80, sortKey: 'area', sortDown: true, tab: 'atlas' });
    expect(store().filter).toMatchObject({ animated: true, tag: 'walk' });
    expect(store().selections).toEqual([{ name: 'walkers', ids: ['spr_1'] }]);
    viewBook.attach('sht_b', undefined);
    expect(store().zoom).toBe(32);
  });

});

describe('the saving of the views', () => {
  it('writes the views to the app storage after a short while, and only when something changed', () => {
    viewBook.attach('sht_a', undefined);
    vi.advanceTimersByTime(SAVE_DELAY_MS * 2);
    expect(saved).toHaveLength(0);
    store().patch({ zoom: 96 });
    store().patch({ zoom: 104 });
    expect(saved).toHaveLength(0);
    vi.advanceTimersByTime(SAVE_DELAY_MS);
    expect(saved).toHaveLength(1);
    expect(lastSaved()['sht_a']?.zoom).toBe(104);
    store().patch({ zoom: 104 });
    vi.advanceTimersByTime(SAVE_DELAY_MS * 2);
    expect(saved).toHaveLength(1);
  });

  it('writes at once on a flush and never saves a dialog that is open', () => {
    viewBook.attach('sht_a', undefined);
    store().patch({ dialog: 'rename', query: 'hero' });
    viewBook.flush();
    expect(saved).toHaveLength(1);
    expect(lastSaved()['sht_a']).toMatchObject({ query: 'hero' });
    expect(lastSaved()['sht_a']).not.toHaveProperty('dialog');
  });

  it('brings the view back after the app was closed and opened again', () => {
    viewBook.attach('sht_a', undefined);
    store().patch({ view: 'list', zoom: 72, sortKey: 'name' });
    store().toggleFolder('hero');
    store().patchAtlas({ extrude: 2, rotate: true, trim: true });
    viewBook.flush();
    const onDisk = gone(lastSaved());
    viewBook.reset();
    useManagerStore.setState({ ...MANAGER_DEFAULTS });
    viewBook.connect((views) => saved.push(views));
    viewBook.attach('sht_a', onDisk);
    expect(store()).toMatchObject({ view: 'list', zoom: 72, sortKey: 'name', collapsed: ['hero'] });
    expect(store().atlas).toMatchObject({ extrude: 2, rotate: true, trim: true });
    expect(store().dialog).toBeNull();
  });

  it('stops following the store once it is detached', () => {
    viewBook.attach('sht_a', undefined);
    viewBook.detach();
    store().patch({ zoom: 120 });
    viewBook.flush();
    vi.advanceTimersByTime(SAVE_DELAY_MS * 2);
    expect(saved).toHaveLength(0);
  });
});
