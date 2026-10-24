/* @layer renderer-app @kind test */
import { resolveDefaults } from '@bxel/project';
import { describe, expect, it, vi } from 'vitest';
import { appAssetDefaults } from '../../src/asset-defaults/app-asset-defaults';
import { memoryOf } from '../../src/asset-defaults/memory-of';
import { initialForm } from '../../src/new-sprite/initial-form';
import { newFormErrors } from '../../src/new-sprite/new-form-errors';
import { createAsset } from '../../src/new-sprite/create-asset';
import { openCreatedAsset } from '../../src/new-sprite/open-created-asset';
import { effectivePlatform } from '../../src/platform-preset/effective-platform';
import { PROJECT_SOURCE } from '../../src/project-config/project-source.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { ROOT } from '../project/project-harness';
import { liveArtwork, openedProject, savedManifest } from './config-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const manifest = () => useProjectStore.getState().project?.manifest;

describe('the project defaults', () => {
  it('start unset, so a new sprite follows the app default', async () => {
    const { documentId } = await openedProject();
    expect(PROJECT_SOURCE.get('project.default.size')).toBeUndefined();
    const app = appAssetDefaults(undefined);
    expect(resolveDefaults(app, manifest()?.defaults ?? {}).size).toEqual({ width: 16, height: 16 });
    const form = initialForm(memoryOf(resolveDefaults(app, manifest()?.defaults ?? {})), []);
    const made = createAsset(useDocumentStore.getState().host, documentId, { ...form, name: 'plain' });
    expect(made.ok).toBe(true);
    const sprite = liveArtwork(documentId).sprites.find((each) => each.name === 'plain');
    expect([sprite?.width, sprite?.height]).toEqual([16, 16]);
  });

  it('are written to the project file when set, and a new sprite picks them up and lands in the sprites folder', async () => {
    const { held, documentId } = await openedProject();
    await PROJECT_SOURCE.set('project.default.size', { width: 24, height: 20 });
    await PROJECT_SOURCE.flush();
    expect(PROJECT_SOURCE.get('project.default.size')).toEqual({ width: 24, height: 20 });
    expect(savedManifest(held).defaults.size).toEqual({ width: 24, height: 20 });
    const defaults = resolveDefaults(appAssetDefaults(undefined), manifest()?.defaults ?? {});
    const form = { ...initialForm(memoryOf(defaults), []), name: 'big' };
    const made = createAsset(useDocumentStore.getState().host, documentId, form);
    if (!made.ok || !made.key) throw new Error('the sprite was not made');
    const sprite = liveArtwork(documentId).sprites.find((each) => each.name === 'big');
    expect([sprite?.width, sprite?.height]).toEqual([24, 20]);
    expect(await openCreatedAsset(documentId, made.key)).toBeNull();
    expect(held.disk.files.has(`${ROOT}/sprites/big.bxsprite`)).toBe(true);
  });

  it('go back to the app default when reset', async () => {
    const { held } = await openedProject();
    await PROJECT_SOURCE.set('project.default.colorLimit', 8);
    await PROJECT_SOURCE.flush();
    expect(savedManifest(held).defaults.colorLimit).toBe(8);
    await PROJECT_SOURCE.set('project.default.colorLimit', undefined);
    await PROJECT_SOURCE.flush();
    expect(PROJECT_SOURCE.get('project.default.colorLimit')).toBeUndefined();
    expect(savedManifest(held).defaults.colorLimit).toBeUndefined();
  });

  it('refuse a value the project file cannot hold, and change nothing', async () => {
    const { held } = await openedProject();
    await PROJECT_SOURCE.set('project.default.colorLimit', 5000);
    await PROJECT_SOURCE.flush();
    expect(PROJECT_SOURCE.get('project.default.colorLimit')).toBeUndefined();
    expect(savedManifest(held).defaults.colorLimit).toBeUndefined();
  });
});

describe('the project platform', () => {
  it('is live: a sprite with no platform of its own follows it, and a sprite with its own keeps it', async () => {
    const { held, documentId } = await openedProject();
    await PROJECT_SOURCE.set('project.default.platformId', 'gb-dmg');
    await PROJECT_SOURCE.flush();
    const artwork = liveArtwork(documentId);
    expect(artwork.platformId).toBe('gb-dmg');
    expect(savedManifest(held).defaults.platformId).toBe('gb-dmg');
    const [first, second] = artwork.sprites;
    expect(effectivePlatform(artwork, first)).toMatchObject({ platformId: 'gb-dmg', inherited: true });
    expect(effectivePlatform(artwork, second && { ...second, platformId: 'nes' })).toMatchObject({ platformId: 'nes', inherited: false });
  });

  it('keeps an explicit no platform apart from the app default', async () => {
    const { held } = await openedProject();
    await PROJECT_SOURCE.set('project.default.platformId', null);
    await PROJECT_SOURCE.flush();
    expect(savedManifest(held).defaults.platformId).toBeNull();
    expect(PROJECT_SOURCE.get('project.default.platformId')).toBeNull();
  });
});

describe('the project cover and name', () => {
  it('writes the cover as a path in the project file and resolves it again when the project opens', async () => {
    const { held, documentId, paths } = await openedProject();
    const hero = liveArtwork(documentId).sprites[0];
    if (!hero) throw new Error('no sprite');
    await PROJECT_SOURCE.set('project.cover', hero.id);
    expect(savedManifest(held).cover?.path).toBe(paths.get(hero.id)?.replace(`${ROOT}/`, ''));
    expect(PROJECT_SOURCE.get('project.cover')).toBe(hero.id);
  });

  it('refuses a cover that has no file yet', async () => {
    const { documentId } = await openedProject();
    const host = useDocumentStore.getState().host;
    const made = createAsset(host, documentId, { ...initialForm(memoryOf(appAssetDefaults(undefined)), []), name: 'unsaved' });
    expect(made.ok).toBe(true);
    const fresh = liveArtwork(documentId).sprites.find((each) => each.name === 'unsaved');
    await PROJECT_SOURCE.set('project.cover', fresh?.id);
    expect(PROJECT_SOURCE.get('project.cover')).toBe('');
  });
});

describe('a new asset of every kind', () => {
  it('is made in the project and written to the folder of its kind', async () => {
    const { held, documentId } = await openedProject();
    const host = useDocumentStore.getState().host;
    const base = initialForm(memoryOf(appAssetDefaults(undefined)), []);
    const made = async (form: Partial<typeof base>): Promise<void> => {
      const outcome = createAsset(host, documentId, { ...base, ...form });
      if (!outcome.ok || !outcome.key) throw new Error(outcome.ok ? 'no key' : outcome.message);
      expect(await openCreatedAsset(documentId, outcome.key)).toBeNull();
    };
    await made({ kind: 'palette', name: 'Warm' });
    await made({ kind: 'tileset', name: 'ground', width: 8, height: 8 });
    const tileset = liveArtwork(documentId).tilesets[0];
    await made({ kind: 'tilemap', name: 'level', tilesetId: tileset?.id ?? '', columns: 4, rows: 3 });
    await made({ kind: 'sheet', name: 'run', columns: 2, rows: 1 });
    const files = [...held.disk.files.keys()];
    expect(files).toContain(`${ROOT}/palettes/Warm.bxpalette`);
    expect(files).toContain(`${ROOT}/tilemaps/ground.bxtiles`);
    expect(files).toContain(`${ROOT}/tilemaps/level.bxmap`);
    expect(files.some((path) => path.startsWith(`${ROOT}/sheets/Sheet`))).toBe(true);
    expect(liveArtwork(documentId).tilemaps[0]).toMatchObject({ columns: 4, rows: 3 });
  });

  it('refuses a map with no tileset', () => {
    const errors = newFormErrors({ ...initialForm(memoryOf(appAssetDefaults(undefined)), []), kind: 'tilemap', name: 'level' }, []);
    expect(errors.sheet).toContain('tileset');
  });
});
