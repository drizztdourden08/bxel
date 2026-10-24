/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PRESET_KINDS } from '../../src/export/preset-list.constants';
import { removePreset } from '../../src/export/remove-preset';
import { renamePreset } from '../../src/export/rename-preset';
import { runPreset } from '../../src/export/run-preset';
import { useExportStore } from '../../src/export/useExportStore';
import { settingsOf } from './export-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const PRESETS = [
  { name: 'Web sheet', settings: settingsOf({ kind: 'sheet', scale: 2, pathTemplate: '{sprite}' }) },
  { name: 'Icons', settings: settingsOf({ kind: 'sprite', scale: 4 }) },
  { name: 'Walk', settings: settingsOf({ kind: 'animation', scale: 3 }) },
];

beforeEach(() => {
  useExportStore.setState({ open: false, request: null });
});

describe('the preset list on the Asset pages', () => {
  it('splits the presets by the kind of asset they export', () => {
    const forSprites = PRESETS.filter((preset) => PRESET_KINDS.sprite.includes(preset.settings.kind)).map((preset) => preset.name);
    const forSheets = PRESETS.filter((preset) => PRESET_KINDS.sheet.includes(preset.settings.kind)).map((preset) => preset.name);
    expect([forSprites, forSheets]).toEqual([['Icons', 'Walk'], ['Web sheet']]);
  });

  it('renames a preset and keeps its settings and place in the list', () => {
    const edit = renamePreset(PRESETS, 'icons', '  Small icons ');
    expect(edit.ok && edit.presets.map((preset) => preset.name)).toEqual(['Web sheet', 'Small icons', 'Walk']);
    expect(edit.ok && edit.presets[1]?.settings).toBe(PRESETS[1]?.settings);
  });

  it('may keep the name with another case, and refuses a name that is empty or already used', () => {
    expect(renamePreset(PRESETS, 'Icons', 'ICONS').ok).toBe(true);
    expect(renamePreset(PRESETS, 'Icons', '   ')).toMatchObject({ ok: false });
    expect(renamePreset(PRESETS, 'Icons', 'walk')).toMatchObject({ ok: false, message: 'A preset named walk already exists.' });
  });

  it('deletes one preset by name and leaves the others', () => {
    expect(removePreset(PRESETS, 'WALK').map((preset) => preset.name)).toEqual(['Web sheet', 'Icons']);
    expect(removePreset(PRESETS, 'missing')).toHaveLength(3);
  });

  it('runs a preset by opening the export window on its settings, without the folder or the project template', () => {
    runPreset(PRESETS[0]?.settings ?? settingsOf({}));
    const { open, request } = useExportStore.getState();
    expect(open).toBe(true);
    expect(request?.kind).toBe('sheet');
    expect(request?.settings).toMatchObject({ kind: 'sheet', scale: 2, approved: false });
    expect(request?.settings).not.toHaveProperty('folder');
    expect(request?.settings).not.toHaveProperty('pathTemplate');
  });
});
