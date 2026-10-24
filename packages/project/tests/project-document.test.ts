/* @layer tests @kind test */
import { createProjectDocument, parseProjectDocument, PROJECT_ERROR_CODE, readManifest, roleFolders, writeProjectDocument } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { sampleManifest } from './sample-manifest';
import { must } from './must';
import { sampleDocument } from './sample-document';

const written = (): string => must(writeProjectDocument(sampleDocument()));

const BROKEN: readonly (readonly [string, (manifest: Record<string, unknown>) => void])[] = [
  ['a version 1 number', (manifest) => (manifest['formatVersion'] = 1)],
  ['an unknown key', (manifest) => (manifest['swatchSets'] = [])],
  ['an unknown role', (manifest) => (manifest['folders'] = [{ folderId: 'fld_7r2k9m4q', name: 'A', path: '.', roles: { music: 'music' } }])],
  ['a role path that climbs out', (manifest) => (manifest['folders'] = [{ folderId: 'fld_7r2k9m4q', name: 'A', path: '.', roles: { sprites: '../x' } }])],
  ['a default size that is too large', (manifest) => (manifest['defaults'] = { size: { width: 5000, height: 8 } })],
  ['an assistant folder the project lacks', (manifest) => (manifest['assistant'] = { access: 'read', folders: ['fld_zzzzzzzz'] })],
  ['a cover in a missing folder', (manifest) => (manifest['cover'] = { folderId: 'fld_zzzzzzzz', path: 'sprites/hero.bxsprite' })],
  ['a cover that climbs out', (manifest) => (manifest['cover'] = { folderId: 'fld_7r2k9m4q', path: '../hero.bxsprite' })],
  ['a default palette in a missing folder', (manifest) => (manifest['defaults'] = { palette: { kind: 'file', folderId: 'fld_zzzzzzzz', path: 'a.bxpalette' } })],
];

describe('manifest v2', () => {
  it('writes in a stable key order and parses back to the same manifest', () => {
    const output = written();
    expect(Object.keys(JSON.parse(output) as object)).toEqual(['format', 'formatVersion', 'projectId', 'name', 'folders', 'defaults', 'assistant']);
    expect(parseProjectDocument(output)).toEqual({ ok: true, value: sampleDocument() });
    expect(writeProjectDocument(sampleDocument())).toEqual({ ok: true, value: output });
  });

  it('writes the cover after the name and reads it back', () => {
    const withCover = { ...sampleDocument(), cover: { folderId: 'fld_7r2k9m4q' as const, path: 'sprites/hero.bxsprite' } };
    const output = must(writeProjectDocument(withCover));
    expect(Object.keys(JSON.parse(output) as object)).toEqual(['format', 'formatVersion', 'projectId', 'name', 'cover', 'folders', 'defaults', 'assistant']);
    expect(parseProjectDocument(output)).toEqual({ ok: true, value: withCover });
  });

  it('fills the missing roles and defaults with empty ones', () => {
    const parsed = parseProjectDocument(
      JSON.stringify({
        format: 'bxel-project',
        formatVersion: 2,
        projectId: 'prj_8d2k4m6q9x1v',
        name: 'Dungeon',
        folders: [{ folderId: 'fld_7r2k9m4q', name: 'Dungeon', path: '.' }],
        assistant: { access: 'off' },
      }),
    );
    expect(parsed.ok && parsed.value.folders[0]?.roles).toEqual({});
    expect(parsed.ok && parsed.value.defaults).toEqual({});
    expect(parsed.ok && parsed.value.assistant.folders).toBeUndefined();
  });

  it.each(BROKEN)('refuses %s', (_label, change) => {
    const manifest = JSON.parse(written()) as Record<string, unknown>;
    change(manifest);
    const parsed = parseProjectDocument(JSON.stringify(manifest));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.code).toBe(PROJECT_ERROR_CODE.MANIFEST_INVALID);
  });

  it('creates a new project with the five role folders', () => {
    const created = createProjectDocument({ projectId: 'prj_8d2k4m6q9x1v', folderId: 'fld_7r2k9m4q', name: 'New' });
    expect(created.folders[0]?.roles).toEqual({ sprites: 'sprites', sheets: 'sheets', palettes: 'palettes', tilemaps: 'tilemaps', exports: 'exports' });
    expect(writeProjectDocument(created).ok).toBe(true);
    expect(roleFolders(created.folders).map((folder) => folder.path)).toEqual(['sprites', 'sheets', 'palettes', 'tilemaps', 'exports']);
  });

  it('lists a role folder once and never the folder root', () => {
    const folders = sampleDocument().folders;
    expect(roleFolders(folders).some((folder) => folder.path === '.')).toBe(false);
    expect(roleFolders(folders)).toHaveLength(5);
  });
});

describe('reading either version', () => {
  it('reads a version 1 manifest as version 1', () => {
    const v1 = JSON.stringify({ ...sampleManifest() });
    const read = readManifest(v1);
    expect(read.ok && read.value.version).toBe(1);
  });

  it('reads a version 2 manifest as version 2', () => {
    const read = readManifest(written());
    expect(read.ok && read.value.version).toBe(2);
  });

  it('refuses text that is not JSON and an unknown version', () => {
    expect(readManifest('{nope').ok).toBe(false);
    expect(readManifest(JSON.stringify({ ...sampleManifest(), formatVersion: 3 })).ok).toBe(false);
  });
});
