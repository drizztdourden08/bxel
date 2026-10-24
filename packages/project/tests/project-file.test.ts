/* @layer tests @kind test */
import { ASSET_FORMAT } from '@bxel/document';
import { detectAssetKind } from '@bxel/document/native';
import { decodeProject, encodeProject, PROJECT_ERROR_CODE } from '@bxel/project';
import type { ProjectFileInput } from '@bxel/project';
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { sampleDocument } from './sample-document';
import { paletteBytes } from './palette-bytes';

const clock = (): number => Date.UTC(2026, 9, 24, 9, 30, 0);
const preview = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]);
const spriteBytes = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]);

const input = (extra: Partial<ProjectFileInput> = {}): ProjectFileInput => ({
  manifest: sampleDocument(),
  preview,
  assets: new Map([['assets/Dungeon/sprites/hero.bxsprite', spriteBytes]]),
  ...extra,
});

const encoded = (value: ProjectFileInput = input()): Uint8Array => {
  const result = encodeProject(value, clock);
  if (!result.ok) throw new Error(result.message);
  return result.value;
};

const rewrite = (bytes: Uint8Array, change: (files: Record<string, Uint8Array>) => void): Uint8Array => {
  const files = unzipSync(bytes);
  change(files);
  return zipSync(files);
};

describe('the project file', () => {
  it('is a zip that other readers detect as a project', () => {
    const bytes = encoded();
    expect(detectAssetKind(bytes, 'Dungeon.bxproject')).toEqual({ kind: 'project', extensionMatches: true });
    const files = unzipSync(bytes);
    expect(Object.keys(files)[0]).toBe('mimetype');
    expect(strFromU8(files['mimetype'] as Uint8Array)).toBe(ASSET_FORMAT.project.mime);
    expect(Object.keys(files)).toContain('project.json');
    expect(Object.keys(files)).toContain('preview.png');
  });

  it('writes byte for byte the same after a decode', () => {
    const first = encoded();
    const decoded = decodeProject(first);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect(decoded.value.manifest).toEqual(sampleDocument());
    expect(decoded.value.preview).toEqual(preview);
    expect(decoded.value.assets.get('assets/Dungeon/sprites/hero.bxsprite')).toEqual(spriteBytes);
    expect(decoded.value.savedAt).toBe('2026-10-24T09:30:00Z');
    const again = encodeProject({ manifest: decoded.value.manifest, preview: decoded.value.preview, assets: decoded.value.assets }, clock);
    expect(again).toEqual({ ok: true, value: first });
  });

  it('writes the same bytes whatever order the assets arrive in', () => {
    const left = new Map([['assets/Dungeon/a.bxsprite', spriteBytes], ['assets/Dungeon/b.bxsprite', preview]]);
    const right = new Map([...left].reverse());
    expect(encoded(input({ assets: left }))).toEqual(encoded(input({ assets: right })));
  });

  it('opens without a cover or assets', () => {
    const decoded = decodeProject(encoded(input({ preview: null, assets: new Map() })));
    expect(decoded.ok && decoded.value.preview).toBeNull();
    expect(decoded.ok && decoded.value.assets.size).toBe(0);
  });

  it('refuses a path outside assets and a broken manifest on write', () => {
    const stray = encodeProject(input({ assets: new Map([['elsewhere/x.bxsprite', spriteBytes]]) }), clock);
    expect(stray.ok).toBe(false);
    const broken = encodeProject(input({ manifest: { ...sampleDocument(), name: 'a/b' } }), clock);
    expect(broken.ok).toBe(false);
  });
});

describe('opening a project file', () => {
  it('names the kind of a file that is not a project', () => {
    const palette = decodeProject(paletteBytes());
    expect(palette.ok).toBe(false);
    if (!palette.ok) {
      expect(palette.code).toBe(PROJECT_ERROR_CODE.PROJECT_FILE_WRONG_KIND);
      expect(palette.message).toContain('palette');
    }
  });

  it('refuses text, a cut file and an archive that is not Bxel', () => {
    expect(decodeProject(strToU8('hello')).ok).toBe(false);
    expect(decodeProject(encoded().slice(0, 40)).ok).toBe(false);
    expect(decodeProject(zipSync({ 'a.txt': strToU8('x') })).ok).toBe(false);
  });

  it('refuses a damaged entry and a project.json that was changed', () => {
    const damaged = decodeProject(rewrite(encoded(), (files) => (files['assets/Dungeon/sprites/hero.bxsprite'] = Uint8Array.from([9, 9, 9, 9, 9, 9, 9, 9]))));
    expect(damaged.ok).toBe(false);
    if (!damaged.ok) expect(damaged.issues[0]?.path).toBe('assets/Dungeon/sprites/hero.bxsprite');
    const edited = decodeProject(rewrite(encoded(), (files) => (files['project.json'] = strToU8('{}'))));
    expect(edited.ok).toBe(false);
  });

  it('opens without the cover when the cover is damaged', () => {
    const decoded = decodeProject(rewrite(encoded(), (files) => (files['preview.png'] = Uint8Array.from([0]))));
    expect(decoded.ok && decoded.value.preview).toBeNull();
  });

  it('refuses a file that needs a newer reader', () => {
    const newer = rewrite(encoded(), (files) => {
      const manifest = JSON.parse(strFromU8(files['manifest.json'] as Uint8Array)) as Record<string, unknown>;
      manifest['minReaderVersion'] = 99;
      manifest['formatVersion'] = 99;
      files['manifest.json'] = strToU8(JSON.stringify(manifest));
    });
    const decoded = decodeProject(newer);
    expect(decoded.ok).toBe(false);
    if (!decoded.ok) expect(decoded.code).toBe(PROJECT_ERROR_CODE.PROJECT_FILE_TOO_NEW);
  });
});
