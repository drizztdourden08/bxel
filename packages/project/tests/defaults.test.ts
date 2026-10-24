/* @layer tests @kind test */
import { resolveDefaults } from '@bxel/project';
import type { AssetDefaults, ProjectDefaults } from '@bxel/project';
import { describe, expect, it } from 'vitest';

const app = (): AssetDefaults => ({
  size: { width: 16, height: 16 },
  colorLimit: 32,
  palette: { kind: 'preset', presetId: 'pico-8' },
  platformId: null,
  platformStrict: false,
  transparent: true,
  frameDurationMs: 100,
  pixelGrid: { width: 8, height: 8 },
});

describe('resolveDefaults', () => {
  it('gives every app default when the project sets nothing', () => {
    expect(resolveDefaults(app(), {})).toEqual(app());
  });

  it('inherits each field on its own', () => {
    const base = app();
    const project: ProjectDefaults = {
      size: { width: 32, height: 48 },
      palette: { kind: 'file', folderId: 'fld_7r2k9m4q', path: 'dawn.bxpalette' },
      transparent: false,
    };
    expect(resolveDefaults(base, project)).toEqual({
      ...base,
      size: { width: 32, height: 48 },
      palette: { kind: 'file', folderId: 'fld_7r2k9m4q', path: 'dawn.bxpalette' },
      transparent: false,
    });
  });

  it('lets a project value that is false, zero-like or null win over the app', () => {
    const base = { ...app(), platformId: 'game-boy', platformStrict: true, transparent: true };
    const resolved = resolveDefaults(base, { platformId: null, platformStrict: false, transparent: false });
    expect(resolved.platformId).toBeNull();
    expect(resolved.platformStrict).toBe(false);
    expect(resolved.transparent).toBe(false);
    expect(resolved.colorLimit).toBe(32);
  });

  it('changes one field per project field and nothing else', () => {
    const base = app();
    const changes: readonly ProjectDefaults[] = [
      { size: { width: 2, height: 2 } },
      { colorLimit: 4 },
      { palette: { kind: 'preset', presetId: 'other' } },
      { platformId: 'nes' },
      { platformStrict: true },
      { transparent: false },
      { frameDurationMs: 250 },
      { pixelGrid: { width: 1, height: 1 } },
    ];
    for (const change of changes) {
      const resolved = resolveDefaults(base, change);
      const differing = Object.keys(base).filter((key) => JSON.stringify(resolved[key as keyof AssetDefaults]) !== JSON.stringify(base[key as keyof AssetDefaults]));
      expect(differing).toEqual(Object.keys(change));
    }
  });

  it('does not change the app defaults it was given', () => {
    const base = app();
    resolveDefaults(base, { colorLimit: 4 });
    expect(base).toEqual(app());
  });
});
