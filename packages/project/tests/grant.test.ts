/* @layer tests @kind test */
import { ACCESS_SECTION_KEY, effectiveGrant } from '@bxel/project';
import type { ProjectGrant } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { sampleManifest } from './sample-manifest';

const ROOT = 'C:/Games/Dungeon';

const grant = (extra: Partial<ProjectGrant> = {}): ProjectGrant => ({
  projectId: 'prj_8d2k4m6q9x1v',
  rootRealPath: ROOT,
  access: 'edit',
  grantedAt: '2026-10-23T10:00:00.000Z',
  ...extra,
});

describe('effective grant', () => {
  it('applies when the id and the real path both match', () => {
    expect(effectiveGrant(sampleManifest(), ROOT, [grant()])).toEqual({ access: 'edit', turnItOnHere: false });
  });

  it('ignores case and separators in the real path', () => {
    expect(effectiveGrant(sampleManifest(), 'c:\\games\\dungeon\\', [grant()])).toEqual({
      access: 'edit',
      turnItOnHere: false,
    });
  });

  it('follows the stored grant, not the manifest', () => {
    expect(effectiveGrant(sampleManifest(), ROOT, [grant({ access: 'read' })])).toEqual({
      access: 'read',
      turnItOnHere: false,
    });
    const off = { ...sampleManifest(), [ACCESS_SECTION_KEY]: { access: 'off' as const } };
    expect(effectiveGrant(off, ROOT, [grant()]).access).toBe('edit');
  });

  it('is off, with the turn-it-on flag, for a project copied to another path', () => {
    expect(effectiveGrant(sampleManifest(), 'D:/Backup/Dungeon', [grant()])).toEqual({
      access: 'off',
      turnItOnHere: true,
    });
  });

  it('is off, with the flag, when the manifest says edit and nothing is stored', () => {
    expect(effectiveGrant(sampleManifest(), ROOT, [])).toEqual({ access: 'off', turnItOnHere: true });
  });

  it('is off for a stored grant of another project id', () => {
    const other = grant({ projectId: 'prj_zzzzzzzzzzzz' });
    expect(effectiveGrant(sampleManifest(), ROOT, [other])).toEqual({ access: 'off', turnItOnHere: true });
  });

  it('does not offer a grant when the manifest is off too', () => {
    const off = { ...sampleManifest(), [ACCESS_SECTION_KEY]: { access: 'off' as const } };
    expect(effectiveGrant(off, ROOT, [])).toEqual({ access: 'off', turnItOnHere: false });
  });

  it('grants nothing from a manifest edited to say edit', () => {
    const edited = { ...sampleManifest(), [ACCESS_SECTION_KEY]: { access: 'edit' as const } };
    expect(effectiveGrant(edited, 'E:/Copy/Dungeon', [])).toMatchObject({ access: 'off' });
  });
});
