/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { ProjectOrganise } from '@bxel/project';
import { applyOrganiseOp } from '../../src/organise/apply-organise-op';
import { EMPTY_ORGANISE } from '../../src/organise/organise.constants';
import type { OrganiseOp } from '../../src/organise/organise.type';
import { opsFromSettings } from '../../src/organise/ops-from-settings';

const run = (start: ProjectOrganise, ...ops: readonly OrganiseOp[]): ProjectOrganise => {
  let held = start;
  for (const op of ops) {
    const change = applyOrganiseOp(held, op);
    if (!change.ok) throw new Error(change.message);
    held = change.organise;
  }
  return held;
};

const refused = (start: ProjectOrganise, op: OrganiseOp): string => {
  const change = applyOrganiseOp(start, op);
  return change.ok ? '' : change.message;
};

describe('organise changes', () => {
  it('tags files with clean, lower case, single tags and removes them again', () => {
    const tagged = run(EMPTY_ORGANISE, { op: 'tag', assets: ['a', 'b'], tags: ['  Hero ', 'hero', 'Big  Boss'] });
    expect(tagged.tags).toEqual({ a: ['hero', 'big boss'], b: ['hero', 'big boss'] });
    const lighter = run(tagged, { op: 'untag', assets: ['a'], tags: ['HERO'] });
    expect(lighter.tags).toEqual({ a: ['big boss'], b: ['hero', 'big boss'] });
    expect(run(lighter, { op: 'untag', assets: ['a', 'b'], tags: [] }).tags).toEqual({});
  });

  it('refuses a tag that is too long and a tag call with no tag', () => {
    expect(refused(EMPTY_ORGANISE, { op: 'tag', assets: ['a'], tags: ['x'.repeat(41)] })).toContain('is not a tag');
    expect(refused(EMPTY_ORGANISE, { op: 'tag', assets: ['a'], tags: [] })).toBe('Give at least one tag.');
  });

  it('pins by asset id once and unpins', () => {
    const pinned = run(EMPTY_ORGANISE, { op: 'pin', assets: ['a', 'b'] }, { op: 'pin', assets: ['a'] });
    expect(pinned.pinned).toEqual(['a', 'b']);
    expect(run(pinned, { op: 'unpin', assets: ['a'] }).pinned).toEqual(['b']);
  });

  it('makes, fills, renames and deletes collections by id or by name', () => {
    const made = run(EMPTY_ORGANISE, { op: 'newCollection', name: ' Heroes ', assets: ['a'] });
    const [collection] = made.collections;
    expect(collection?.name).toBe('Heroes');
    const filled = run(made, { op: 'collect', assets: ['b', 'a'], collection: 'heroes' });
    expect(filled.collections[0]?.assets).toEqual(['a', 'b']);
    const renamed = run(filled, { op: 'renameCollection', collection: collection?.id ?? '', name: 'Players' });
    expect(renamed.collections[0]?.name).toBe('Players');
    expect(run(renamed, { op: 'uncollect', assets: ['a'], collection: 'Players' }).collections[0]?.assets).toEqual(['b']);
    expect(run(renamed, { op: 'deleteCollection', collection: 'players' }).collections).toEqual([]);
    expect(refused(made, { op: 'newCollection', name: 'heroes' })).toContain('already there');
    expect(refused(made, { op: 'collect', assets: ['a'], collection: 'nope' })).toBe('There is no collection nope.');
  });

  it('saves a search once under its name and removes it', () => {
    const saved = run(EMPTY_ORGANISE, { op: 'saveSearch', name: 'Heroes', query: 'tag:hero is:unsaved' });
    expect(saved.smart).toHaveLength(1);
    expect(run(saved, { op: 'saveSearch', name: 'heroes', query: 'tag:hero is:unsaved' }).smart).toHaveLength(1);
    expect(refused(saved, { op: 'saveSearch', name: 'Heroes', query: 'kind:sheet' })).toContain('already there');
    expect(run(saved, { op: 'removeSearch', search: 'HEROES' }).smart).toEqual([]);
  });

  it('forgets removed files everywhere', () => {
    const full = run(EMPTY_ORGANISE, { op: 'tag', assets: ['a', 'b'], tags: ['x'] }, { op: 'pin', assets: ['a'] }, { op: 'newCollection', name: 'C', assets: ['a', 'b'] });
    const after = run(full, { op: 'forget', assets: ['a'] });
    expect(after.tags).toEqual({ b: ['x'] });
    expect(after.pinned).toEqual([]);
    expect(after.collections[0]?.assets).toEqual(['b']);
  });
});

describe('moving pins and smart filters out of the settings', () => {
  it('turns pinned paths into pinned asset ids and keeps the smart filters', () => {
    const paths = new Map([
      ['spr_1', 'D:/Art/sprites/hero.bxsprite'],
      ['spr_2', 'D:/Art/sprites/orc.bxsprite'],
    ]);
    const ops = opsFromSettings({ pinned: ['d:\\Art\\sprites\\Hero.bxsprite', 'D:/Art/gone.bxsprite'], smart: [{ id: 's', name: 'Open', query: 'is:open' }] }, paths);
    expect(ops).toEqual([
      { op: 'pin', assets: ['spr_1'] },
      { op: 'saveSearch', name: 'Open', query: 'is:open' },
    ]);
    expect(run(EMPTY_ORGANISE, ...ops)).toMatchObject({ pinned: ['spr_1'], smart: [{ name: 'Open', query: 'is:open' }] });
  });

  it('does nothing when there was nothing to move', () => {
    expect(opsFromSettings({ pinned: [], smart: [] }, new Map())).toEqual([]);
  });
});
