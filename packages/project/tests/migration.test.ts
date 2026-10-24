/* @layer tests @kind test */
import { counterIdSource } from '@bxel/document';
import { decodePalette, encodePalette } from '@bxel/document/native';
import { parseProjectDocument, planMigration, writeProjectDocument } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { sampleManifest } from './sample-manifest';
import { sampleV1WithSets } from './sample-document';

const plan = (manifest = sampleV1WithSets()) => {
  const result = planMigration(manifest, { ids: counterIdSource() });
  if (!result.ok) throw new Error(result.message);
  return result.value;
};

describe('migration from version 1', () => {
  it('turns a manifest with two swatch sets into a version 2 manifest and two palette plans', () => {
    const migrated = plan();
    expect(migrated.manifest.formatVersion).toBe(2);
    expect(migrated.manifest).not.toHaveProperty('swatchSets');
    expect(migrated.palettes).toHaveLength(2);
    expect(migrated.palettes.map((each) => each.setId)).toEqual(['sws_aaaaaa11', 'sws_bbbbbb22']);
    const written = writeProjectDocument(migrated.manifest);
    expect(written.ok && parseProjectDocument(written.value)).toEqual({ ok: true, value: migrated.manifest });
  });

  it('places each palette in the palettes folder with a unique file name', () => {
    const paths = plan().palettes.map((each) => each.location);
    expect(paths).toEqual([
      { folderId: 'fld_7r2k9m4q', path: 'palettes/Dawn Ones.bxpalette' },
      { folderId: 'fld_7r2k9m4q', path: 'palettes/Dawn Ones 2.bxpalette' },
    ]);
  });

  it('makes each bank as large as its colour count, without transparency', () => {
    const [first, second] = plan().palettes;
    const bank = first?.slice.artwork.banks?.[0];
    expect(bank?.cap).toBe(3);
    expect(bank?.transparent).toBe(false);
    expect(bank?.slots).toHaveLength(3);
    expect(bank?.slots[1]).toMatchObject({ kind: 'color', rgb: '#ffffff', name: '#ffffff' });
    expect(second?.slice.artwork.banks?.[0]?.cap).toBe(1);
  });

  it('writes palette plans that the palette codec reads back', () => {
    for (const palette of plan().palettes) {
      const bytes = encodePalette(palette.slice, null, () => 0);
      const report = decodePalette(bytes);
      expect(report.outcome).toBe('ok');
      expect(report.slice?.artwork.banks).toEqual(palette.slice.artwork.banks);
    }
  });

});

describe('migration from version 1: folders and files', () => {
  it('maps the new files and exports settings to roles and adds the other role folders', () => {
    const migrated = plan();
    expect(migrated.manifest.folders[0]?.roles).toEqual({ sprites: 'sprites', sheets: 'sheets', palettes: 'palettes', tilemaps: 'tilemaps', exports: 'exports' });
    expect(migrated.manifest.folders[1]?.roles).toEqual({});
    expect(migrated.createFolders.map((folder) => folder.path)).toEqual(['sprites', 'sheets', 'palettes', 'tilemaps', 'exports']);
  });

  it('keeps the project palette as a default palette file and the grant as it was', () => {
    const migrated = plan();
    expect(migrated.manifest.defaults).toEqual({ palette: { kind: 'file', folderId: 'fld_3m8q2k7x', path: 'dawnbringer-16.gpl' } });
    expect(migrated.manifest.assistant).toEqual({ access: 'edit' });
    expect(migrated.manifest.projectId).toBe('prj_8d2k4m6q9x1v');
  });

  it('names the project file and the old file to move to the trash', () => {
    const migrated = plan();
    expect(migrated.projectFileName).toBe('Dungeon.bxproject');
    expect(migrated.trash).toBe('Dungeon.bxelproject');
    const renamed = planMigration(sampleV1WithSets(), { ids: counterIdSource(), sourceFileName: 'old.bxelproject' });
    expect(renamed.ok && renamed.value.trash).toBe('old.bxelproject');
  });

  it('needs no palette plan when there are no swatch sets, and a root level folder maps to a dot role', () => {
    const base = sampleManifest();
    const flat = { ...base, settings: { ...base.settings, newFiles: { folderId: base.settings.newFiles.folderId, path: '.' }, palette: null } };
    const migrated = plan(flat);
    expect(migrated.palettes).toEqual([]);
    expect(migrated.manifest.folders[0]?.roles.sprites).toBe('.');
    expect(migrated.manifest.defaults).toEqual({});
    expect(migrated.createFolders.map((folder) => folder.path)).toEqual(['sheets', 'palettes', 'tilemaps', 'exports']);
  });

  it('gives an unusable set name a plain file name', () => {
    const base = sampleV1WithSets();
    const odd = { ...base, swatchSets: [{ ...(base.swatchSets[0] as (typeof base.swatchSets)[number]), name: '???' }, { ...(base.swatchSets[1] as (typeof base.swatchSets)[number]), name: 'a/b:c' }] };
    expect(plan(odd).palettes.map((each) => each.location.path)).toEqual(['palettes/Palette.bxpalette', 'palettes/a-b-c.bxpalette']);
  });
});
