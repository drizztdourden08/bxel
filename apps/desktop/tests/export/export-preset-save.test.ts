/* @layer renderer-app @kind test */
import { presetsOf } from '@bxel/document';
import { decodeSheet, decodeSprite } from '@bxel/document/native';
import { describe, expect, it, vi } from 'vitest';
import { savePreset } from '../../src/export/save-preset';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { savedManifest } from '../config/config-harness';
import { artworkOf } from '../workspace/open-sample-project';
import { settingsOf } from './export-harness';
import { openSheetTab, presetRig } from './preset-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const { held, project } = presetRig();

describe('saving a preset into the open project', () => {
  it('writes a preset for the current sprite into the sprite and saves it with the sprite file', async () => {
    const { documentId, paths } = await project();
    const sprite = artworkOf(documentId).sprites[0];
    if (!sprite) throw new Error('no sprite');
    useSpriteStore.setState({ activeId: sprite.id });
    const saved = savePreset('Web 2x', settingsOf({ kind: 'sprite', sprites: 'current', scale: 2 }));
    expect(saved).toEqual({ ok: true, where: `sprite ${sprite.name}` });
    expect(presetsOf(artworkOf(documentId), { kind: 'sprite', id: sprite.id }).map((preset) => [preset.name, preset.scale, preset.format])).toEqual([['Web 2x', 2, 'png']]);
    expect([...(useWorkspaceStore.getState().workspaces[documentId]?.dirty ?? [])]).toEqual([`sprite:${sprite.id}`]);
    await saveWorkspace(held().kit, documentId);
    expect(held().disk.writes).toEqual([paths.get(sprite.id)]);
    const read = decodeSprite(held().disk.files.get(paths.get(sprite.id) ?? '') as Uint8Array);
    expect(read.slice?.artwork.presets?.map((preset) => preset.name)).toEqual(['Web 2x']);
  });

  it('writes a sheet export into the sheet and the sheet file', async () => {
    const { documentId, paths } = await project();
    const sheet = artworkOf(documentId).sheets[0];
    if (!sheet) throw new Error('no sheet');
    const saved = savePreset('Atlas', settingsOf({ kind: 'sheet', sprites: 'sheet', sheetId: sheet.id }));
    expect(saved).toEqual({ ok: true, where: `sheet ${sheet.name}` });
    await saveWorkspace(held().kit, documentId);
    expect(held().disk.writes).toEqual([paths.get(sheet.id)]);
    const sprites = artworkOf(documentId).sprites.map((each) => decodeSprite(held().disk.files.get(paths.get(each.id) ?? '') as Uint8Array).slice);
    const read = decodeSheet(held().disk.files.get(paths.get(sheet.id) ?? '') as Uint8Array, sprites.flatMap((slice) => (slice ? [slice] : [])));
    expect(read.slice?.artwork.presets?.map((preset) => preset.name)).toEqual(['Atlas']);
  });

  it('uses the sheet of the open tab when the settings name none', async () => {
    const { documentId } = await project();
    const sheet = artworkOf(documentId).sheets[0];
    if (!sheet) throw new Error('no sheet');
    openSheetTab(documentId, sheet.id);
    expect(savePreset('Tab sheet', settingsOf({ kind: 'sheet', sheetId: '' }))).toEqual({ ok: true, where: `sheet ${sheet.name}` });
  });

});

describe('saving a project preset', () => {
  it('keeps a preset for several sprites in the project file', async () => {
    const { documentId } = await project();
    const saved = savePreset('Everything', settingsOf({ kind: 'sprite', sprites: 'all', scale: 4 }));
    expect(saved).toEqual({ ok: true, where: 'the project' });
    const artwork = artworkOf(documentId);
    expect(presetsOf(artwork, { kind: 'project', id: artwork.id }).map((preset) => preset.name)).toEqual(['Everything']);
    expect([...(useWorkspaceStore.getState().workspaces[documentId]?.dirty ?? [])]).toEqual([`project:${artwork.id}`]);
    await saveWorkspace(held().kit, documentId);
    expect(savedManifest(held()).export?.presets?.map((preset) => [preset.name, preset.scale])).toEqual([['Everything', 4]]);
  });

  it('replaces the preset of the same name in the same place', async () => {
    const { documentId } = await project();
    savePreset('Everything', settingsOf({ kind: 'sprite', sprites: 'all', scale: 4 }));
    savePreset('everything', settingsOf({ kind: 'sprite', sprites: 'all', scale: 6 }));
    const artwork = artworkOf(documentId);
    expect(presetsOf(artwork, { kind: 'project', id: artwork.id }).map((preset) => [preset.name, preset.scale])).toEqual([['Everything', 6]]);
  });

  it('gives back nothing when the document cannot take it, so the caller keeps an app preset', async () => {
    const { documentId } = await project();
    useDocumentStore.getState().setActive(null);
    expect(savePreset('Lost', settingsOf({}))).toBeNull();
    useDocumentStore.getState().setActive(documentId);
    expect(savePreset('Found', settingsOf({ sprites: 'all' }))?.ok).toBe(true);
  });

  it('reports the engine message when the command is refused', async () => {
    await project();
    const first = savePreset('One', settingsOf({ sprites: 'all' }));
    const blank = savePreset('   ', settingsOf({ sprites: 'all' }));
    expect(first?.ok).toBe(true);
    expect(blank).toMatchObject({ ok: false });
  });
});

