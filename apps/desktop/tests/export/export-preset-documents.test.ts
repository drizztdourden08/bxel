/* @layer renderer-app @kind test */
import { presetsOf } from '@bxel/document';
import { describe, expect, it, vi } from 'vitest';
import { browseFilters } from '../../src/export/browse-filters';
import { deleteDocumentPreset } from '../../src/export/delete-document-preset';
import { movePresets } from '../../src/export/move-presets';
import { presetEntries } from '../../src/export/preset-entries';
import { presetFormat } from '../../src/export/preset-format';
import { presetGroups } from '../../src/export/preset-groups';
import { presetSettingsJson } from '../../src/export/preset-settings-json';
import { renameDocumentPreset } from '../../src/export/rename-document-preset';
import { savePreset } from '../../src/export/save-preset';
import { savedFromPreset } from '../../src/export/saved-from-preset';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { artworkOf } from '../workspace/open-sample-project';
import { settingsOf } from './export-harness';
import { presetRig } from './preset-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const { project } = presetRig();

describe('turning settings into a document preset and back', () => {
  it('names the format from the kind, the animation and the colour mode', () => {
    expect(presetFormat(settingsOf({ kind: 'sprite' }))).toBe('png');
    expect(presetFormat(settingsOf({ kind: 'frames', colour: 'indexed' }))).toBe('png-indexed');
    expect(presetFormat(settingsOf({ kind: 'animation', animation: 'apng' }))).toBe('apng');
    expect(presetFormat(settingsOf({ kind: 'animation', animation: 'gif' }))).toBe('gif');
    expect(presetFormat(settingsOf({ kind: 'sheet' }))).toBe('sheet');
  });

  it('leaves out the folder, the template and the approval, and keeps the rest', () => {
    const json = presetSettingsJson(settingsOf({ kind: 'sheet', folder: 'C:\\out', pathTemplate: '{sprite}', approved: true, columns: 6 }));
    expect(json).not.toHaveProperty('folder');
    expect(json).not.toHaveProperty('pathTemplate');
    expect(json).not.toHaveProperty('approved');
    expect(json).toMatchObject({ kind: 'sheet', columns: 6 });
  });

  it('reads a preset from the file with defaults for what is missing or of the wrong type', () => {
    const preset = {
      id: 'exp_000001',
      name: 'Odd',
      format: 'png',
      scale: 3,
      scope: { sprites: [], layers: { by: 'all' }, frames: { by: 'all' } },
      sheetId: null,
      pathTemplate: '{name}',
      settings: { kind: 'frames', columns: 'wide', rotate: true, unknown: 4 },
    } as const;
    const saved = savedFromPreset(preset as never);
    expect(saved.name).toBe('Odd');
    expect(saved.settings).toMatchObject({ kind: 'frames', scale: 3, columns: 4, rotate: true, folder: '', approved: false });
    expect(saved.settings).not.toHaveProperty('unknown');
  });

  it('falls back to a sprite export for a kind it does not know', () => {
    const preset = { id: 'exp_000001', name: 'X', format: 'png', scale: 1, scope: { sprites: [], layers: { by: 'all' }, frames: { by: 'all' } }, sheetId: null, pathTemplate: '{name}', settings: { kind: 'hologram' } };
    expect(savedFromPreset(preset as never).settings.kind).toBe('sprite');
  });
});

describe('the presets an asset page and the Export window list', () => {
  it('lists the asset presets first, then the project ones, then the app ones', async () => {
    const { documentId } = await project();
    const sprite = artworkOf(documentId).sprites[0];
    if (!sprite) throw new Error('no sprite');
    useSpriteStore.setState({ activeId: sprite.id });
    savePreset('Mine', settingsOf({ sprites: 'current' }));
    savePreset('Shared', settingsOf({ sprites: 'all' }));
    const app = [{ name: 'Old', settings: settingsOf({ kind: 'animation' }) }];
    const entries = presetEntries(artworkOf(documentId), { kind: 'sprite', id: sprite.id }, app);
    expect(entries.map((entry) => [entry.name, entry.origin])).toEqual([['Mine', 'asset'], ['Shared', 'project'], ['Old', 'app']]);
    expect(presetGroups(entries).map((group) => group.label)).toEqual(['This asset', 'Project presets', 'App presets']);
    const elsewhere = presetEntries(artworkOf(documentId), { kind: 'sheet', id: artworkOf(documentId).sheets[0]?.id ?? '' }, []);
    expect(elsewhere.map((entry) => entry.name)).toEqual(['Shared']);
  });

  it('renames and deletes a document preset as undoable steps and says why a rename is refused', async () => {
    const { documentId } = await project();
    savePreset('One', settingsOf({ sprites: 'all' }));
    savePreset('Two', settingsOf({ sprites: 'all' }));
    const artwork = artworkOf(documentId);
    const [one, two] = presetsOf(artwork, { kind: 'project', id: artwork.id });
    if (!one || !two) throw new Error('no presets');
    expect(renameDocumentPreset(one.id, 'two')).toContain('already used');
    expect(renameDocumentPreset(one.id, 'Uno')).toBeNull();
    expect(deleteDocumentPreset(two.id)).toBeNull();
    expect(presetsOf(artworkOf(documentId), { kind: 'project', id: artwork.id }).map((preset) => preset.name)).toEqual(['Uno']);
    useDocumentStore.getState().host.undo(documentId);
    expect(presetsOf(artworkOf(documentId), { kind: 'project', id: artwork.id }).map((preset) => preset.name)).toEqual(['Uno', 'Two']);
  });
});

describe('moving the app presets into the project', () => {
  it('writes each one into the project in one undo step, keeping a name that is already taken', async () => {
    const { documentId } = await project();
    savePreset('Icons', settingsOf({ sprites: 'all' }));
    const before = useDocumentStore.getState().host.view(documentId)?.state.revision ?? 0;
    const moved = movePresets([
      { name: 'icons', settings: settingsOf({ kind: 'sprite', scale: 3 }) },
      { name: 'Walk', settings: settingsOf({ kind: 'animation', animation: 'apng', scale: 2 }) },
    ]);
    expect(moved).toEqual({ ok: true, count: 2 });
    expect(useDocumentStore.getState().host.view(documentId)?.state.revision).toBe(before + 1);
    const artwork = artworkOf(documentId);
    expect(presetsOf(artwork, { kind: 'project', id: artwork.id }).map((preset) => [preset.name, preset.format, preset.scale])).toEqual([
      ['Icons', 'png', 1],
      ['icons (2)', 'png', 3],
      ['Walk', 'apng', 2],
    ]);
  });

  it('moves nothing and says so when no document is open', () => {
    useDocumentStore.getState().setActive(null);
    expect(movePresets([{ name: 'A', settings: settingsOf({}) }])).toMatchObject({ ok: false });
  });
});

describe('the file filter of Browse', () => {
  it('follows the animation format and stays PNG for a single image', () => {
    expect(browseFilters(settingsOf({ kind: 'animation', animation: 'gif' }))).toEqual([{ name: 'GIF image', extensions: ['gif'] }]);
    expect(browseFilters(settingsOf({ kind: 'animation', animation: 'apng' }))).toEqual([{ name: 'Animated PNG image', extensions: ['png'] }]);
    expect(browseFilters(settingsOf({ kind: 'sprite' }))).toEqual([{ name: 'PNG image', extensions: ['png'] }]);
  });
});
