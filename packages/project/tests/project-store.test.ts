/* @layer tests @kind test */
import {
  createManifest,
  dropRecentProject,
  grantAccess,
  isManifestFile,
  manifestFileName,
  parseGrants,
  parseManifest,
  parseRecentProjects,
  pushRecentProject,
  setGrant,
  writeManifest,
} from '@bxel/project';
import type { ProjectGrant, RecentProject } from '@bxel/project';
import { describe, expect, it } from 'vitest';

const grant = (extra: Partial<ProjectGrant> = {}): ProjectGrant => ({
  projectId: 'prj_8d2k4m6q9x1v',
  rootRealPath: 'C:/Games/Dungeon',
  access: 'read',
  grantedAt: '2026-10-24T10:00:00.000Z',
  ...extra,
});

const recent = (extra: Partial<RecentProject> = {}): RecentProject => ({
  projectId: 'prj_8d2k4m6q9x1v',
  name: 'Dungeon',
  rootRealPath: 'C:/Games/Dungeon',
  openedAt: '2026-10-24T10:00:00.000Z',
  ...extra,
});

describe('a new manifest', () => {
  const manifest = createManifest({ projectId: 'prj_8d2k4m6q9x1v', folderId: 'fld_7r2k9m4q', name: 'Dungeon' });

  it('has one root folder, no assistant access and passes the manifest rules', () => {
    expect(manifest.folders).toEqual([{ folderId: 'fld_7r2k9m4q', name: 'Dungeon', path: '.' }]);
    expect(manifest.assistant.access).toBe('off');
    const text = writeManifest(manifest);
    expect(text.ok).toBe(true);
    if (text.ok) expect(parseManifest(text.value)).toEqual({ ok: true, value: manifest });
  });

  it('is refused by the writer for a name that breaks the name rule', () => {
    expect(writeManifest({ ...manifest, name: 'a/b' }).ok).toBe(false);
  });

  it('names its file after the project and the reader recognises it', () => {
    expect(manifestFileName('Dungeon')).toBe('Dungeon.bxelproject');
    expect(isManifestFile('Dungeon.BXELPROJECT')).toBe(true);
    expect(isManifestFile('hero.bxel')).toBe(false);
  });
});

describe('stored grants', () => {
  it('adds a grant, replaces the same project at the same path and removes it on off', () => {
    const added = setGrant([], grant());
    expect(added).toHaveLength(1);
    const raised = setGrant(added, grant({ access: 'edit', rootRealPath: 'c:\\games\\dungeon\\' }));
    expect(raised).toHaveLength(1);
    expect(raised[0]?.access).toBe('edit');
    expect(setGrant(raised, grant({ access: 'off' }))).toEqual([]);
  });

  it('keeps one grant per project and path', () => {
    const both = setGrant(setGrant([], grant()), grant({ rootRealPath: 'D:/Copy/Dungeon' }));
    expect(both).toHaveLength(2);
    expect(grantAccess(both, 'prj_8d2k4m6q9x1v', 'D:/Copy/Dungeon')).toBe('read');
    expect(grantAccess(both, 'prj_8d2k4m6q9x1v', 'E:/Other')).toBe('off');
  });

  it('reads a stored list tolerantly: bad entries, off entries and twins are dropped', () => {
    const stored = [grant(), grant({ access: 'edit' }), { projectId: 'nope' }, 7, grant({ projectId: 'prj_zzzzzzzzzzzz', access: 'off' })];
    expect(parseGrants(stored)).toEqual([grant()]);
    expect(parseGrants('x')).toEqual([]);
    expect(parseGrants(undefined)).toEqual([]);
  });
});

describe('recent projects', () => {
  it('puts the newest first and moves a reopened project to the front', () => {
    const first = pushRecentProject([], recent());
    const second = pushRecentProject(first, recent({ projectId: 'prj_zzzzzzzzzzzz', name: 'Forest', rootRealPath: 'C:/Games/Forest' }));
    expect(second.map((entry) => entry.name)).toEqual(['Forest', 'Dungeon']);
    expect(pushRecentProject(second, recent({ rootRealPath: 'c:\\games\\dungeon' })).map((entry) => entry.name)).toEqual(['Dungeon', 'Forest']);
  });

  it('keeps at most ten', () => {
    let list: readonly RecentProject[] = [];
    for (let at = 0; at < 14; at += 1) list = pushRecentProject(list, recent({ rootRealPath: `C:/Games/P${at}` }));
    expect(list).toHaveLength(10);
    expect(list[0]?.rootRealPath).toBe('C:/Games/P13');
  });

  it('drops one by its path and reads a stored list tolerantly', () => {
    expect(dropRecentProject([recent()], 'C:\\Games\\Dungeon')).toEqual([]);
    expect(parseRecentProjects([recent(), { name: 3 }, null])).toEqual([recent()]);
    expect(parseRecentProjects({})).toEqual([]);
  });
});
