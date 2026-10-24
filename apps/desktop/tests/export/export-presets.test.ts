/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { applyPatch } from '../../src/export/apply-patch';
import { DEFAULT_EXPORT_SETTINGS } from '../../src/export/export.constants';
import { startSettings } from '../../src/export/start-settings';
import { upsertPreset } from '../../src/export/upsert-preset';
import { settingsOf } from './export-harness';

describe('export presets and settings', () => {
  it('adds a preset and updates one with the same name', () => {
    const first = { name: 'Web sheet', settings: settingsOf({ kind: 'sheet' }) };
    const added = upsertPreset([], first);
    expect(added).toEqual([first]);
    const updated = upsertPreset(added, { name: 'web sheet', settings: settingsOf({ kind: 'sheet', scale: 4 }) });
    expect(updated).toHaveLength(1);
    expect(updated[0]?.settings.scale).toBe(4);
    expect(upsertPreset(updated, { name: 'Icons', settings: settingsOf({}) })).toHaveLength(2);
  });

  it('opens on the last used settings and asks for approval again', () => {
    const last = settingsOf({ kind: 'animation', approved: true, folder: '' });
    const start = startSettings(last, 'C:\\art');
    expect(start.kind).toBe('animation');
    expect(start.approved).toBe(false);
    expect(start.folder).toBe('C:\\art');
    expect(startSettings(undefined, '')).toEqual(DEFAULT_EXPORT_SETTINGS);
  });

  it('moves the frame choice with the kind', () => {
    const sprite = settingsOf({});
    const sheet = applyPatch(sprite, { kind: 'sheet' });
    expect(sheet.frames).toBe('all');
    expect(applyPatch(sheet, { kind: 'sprite' }).frames).toBe('current');
    expect(applyPatch({ ...sheet, frames: 'tag' }, { kind: 'frames' }).frames).toBe('tag');
  });
});
