/* @layer tests @kind test */
import { parseManifest, PATH_LIMITS, PROJECT_ERROR_CODE, writeManifest } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { sampleManifest } from './sample-manifest';

const text = (value: unknown): string => JSON.stringify(value);

const written = (): string => {
  const result = writeManifest(sampleManifest());
  if (!result.ok) throw new Error(result.message);
  return result.value;
};

const BROKEN: readonly (readonly [string, (manifest: Record<string, unknown>) => void])[] = [
  ['an unknown format', (manifest) => (manifest['format'] = 'bxel')],
  ['a newer format version', (manifest) => (manifest['formatVersion'] = 2)],
  ['a bad project id', (manifest) => (manifest['projectId'] = 'prj_nope')],
  ['an artwork id in the project id', (manifest) => (manifest['projectId'] = 'art_8d2k4m6q9x1v')],
  ['a name with a slash', (manifest) => (manifest['name'] = 'a/b')],
  ['a name that is too long', (manifest) => (manifest['name'] = 'a'.repeat(PATH_LIMITS.maxProjectName + 1))],
  ['a reserved name', (manifest) => (manifest['name'] = 'NUL')],
  ['an unknown key', (manifest) => (manifest['colour'] = 'red')],
  ['an unknown access level', (manifest) => (manifest['assistant'] = { access: 'write' })],
  ['no folders', (manifest) => (manifest['folders'] = [])],
];

const brokenFolders = (change: (folders: Record<string, unknown>[]) => void) => (manifest: Record<string, unknown>) => {
  const folders = manifest['folders'] as Record<string, unknown>[];
  change(folders);
};

describe('manifest round trip', () => {
  it('writes in a stable key order', () => {
    const output = written();
    expect(output.endsWith('}\n')).toBe(true);
    const keys = Object.keys(JSON.parse(output) as object);
    expect(keys).toEqual(['format', 'formatVersion', 'projectId', 'name', 'folders', 'settings', 'assistant']);
    expect(output).toContain('"folderId": "fld_7r2k9m4q",\n      "name": "Dungeon",\n      "path": "."');
    expect(writeManifest(sampleManifest())).toEqual({ ok: true, value: output });
  });

  it('parses what it wrote back to the same manifest', () => {
    expect(parseManifest(written())).toEqual({ ok: true, value: sampleManifest() });
  });

  it('keeps the order when the input keys are shuffled', () => {
    const shuffled = Object.fromEntries(Object.entries(sampleManifest()).reverse());
    const parsed = parseManifest(text(shuffled));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(writeManifest(parsed.value)).toEqual({ ok: true, value: written() });
  });

  it('accepts a byte order mark and a project without a palette', () => {
    const manifest = { ...sampleManifest(), settings: { ...sampleManifest().settings, palette: null } };
    const result = writeManifest(manifest);
    expect(result.ok).toBe(true);
    if (result.ok) expect(parseManifest(`\uFEFF${result.value}`)).toEqual({ ok: true, value: manifest });
  });

  it('accepts settings that name the folder itself', () => {
    const base = sampleManifest();
    const manifest = { ...base, settings: { ...base.settings, newFiles: { folderId: base.settings.newFiles.folderId, path: '.' } } };
    expect(writeManifest(manifest).ok).toBe(true);
  });
});

describe('manifest refusals', () => {
  it('refuses text that is not JSON', () => {
    expect(parseManifest('{ nope')).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.MANIFEST_INVALID });
    expect(parseManifest('')).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.MANIFEST_INVALID });
  });

  it.each(BROKEN)('refuses %s with the field named', (_label, change) => {
    const manifest: Record<string, unknown> = JSON.parse(written()) as Record<string, unknown>;
    change(manifest);
    const result = parseManifest(text(manifest));
    expect(result).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.MANIFEST_INVALID });
    if (!result.ok) expect(result.issues.length).toBeGreaterThan(0);
  });

  it.each([
    ['the root not first', (folders: Record<string, unknown>[]) => folders.reverse(), 'folders.0.path'],
    ['a second root', (folders: Record<string, unknown>[]) => (folders[1] && (folders[1]['path'] = '.')), 'folders.1.path'],
    ['a repeated folder id', (folders: Record<string, unknown>[]) => (folders[1] && (folders[1]['folderId'] = 'fld_7r2k9m4q')), 'folders.1.folderId'],
    ['a backslash path', (folders: Record<string, unknown>[]) => (folders[1] && (folders[1]['path'] = 'D:\\Art')), 'folders.1.path'],
  ])('refuses %s', (_label, change, issuePath) => {
    const manifest: Record<string, unknown> = JSON.parse(written()) as Record<string, unknown>;
    brokenFolders(change)(manifest);
    const result = parseManifest(text(manifest));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues.map((issue) => issue.path)).toContain(issuePath);
  });

  it('refuses more than 16 folders', () => {
    const manifest = sampleManifest();
    const extra = Array.from({ length: 16 }, (_unused, index) => ({
      folderId: `fld_0000000${index.toString(16)}x` as const,
      name: `Linked ${index}`,
      path: `D:/Linked${index}`,
    }));
    const result = parseManifest(text({ ...manifest, folders: [...manifest.folders, ...extra] }));
    expect(result).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.MANIFEST_INVALID });
    expect(writeManifest({ ...manifest, folders: [...manifest.folders, ...extra] }).ok).toBe(false);
  });

  it('refuses a setting that names a missing folder or breaks the path rule', () => {
    const base = sampleManifest();
    const missing = { ...base, settings: { ...base.settings, exports: { folderId: 'fld_zzzzzzzz', path: 'exports' } } };
    const parsed = parseManifest(text(missing));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.issues.map((issue) => issue.path)).toContain('settings.exports.folderId');
    for (const path of ['../out', 'a\\b', 'nul', 'a/./b', '/abs']) {
      const bad = { ...base, settings: { ...base.settings, newFiles: { folderId: base.settings.newFiles.folderId, path } } };
      expect(parseManifest(text(bad)).ok).toBe(false);
    }
    const noRootPalette = { ...base, settings: { ...base.settings, palette: { folderId: base.settings.newFiles.folderId, path: '.' } } };
    expect(parseManifest(text(noRootPalette)).ok).toBe(false);
  });

  it('refuses to write an invalid manifest', () => {
    const manifest = { ...sampleManifest(), name: 'bad/name' };
    expect(writeManifest(manifest)).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.MANIFEST_INVALID });
  });
});
