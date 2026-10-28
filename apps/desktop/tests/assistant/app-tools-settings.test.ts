/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SETTINGS_SOURCES } from '../../src/assistant/tools/settings-sources.constants';
import { check } from './app-tools-check';
import { fake } from './app-tools-fake';
import { call, openDocument, reset } from './app-tools-rig';
import { fakeSource } from './app-tools-source';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok, code } = check;

const SCREENS = [
  {
    id: 'canvas',
    label: 'Canvas',
    group: 'App',
    route: 'settings/canvas',
    items: [
      { key: 'gridSize', label: 'Grid', value: 8, kind: 'number', min: 1, max: 64 },
      { key: 'theme', label: 'Theme', value: 'dark', kind: 'select', choices: ['dark', 'light'] },
      { key: 'assistantPrograms', label: 'Programs', value: [{ key: 'secret' }] },
      { key: 'keymap', label: 'Keys', value: {} },
    ],
  },
  { id: 'general', label: 'General', group: 'Project', route: 'project/general', items: [{ key: 'project.name', label: 'Name', value: 'Dungeon', source: 'custom' as const, kind: 'text' }] },
  {
    id: 'sprite',
    label: 'Sprite',
    group: 'Asset',
    route: 'asset/sprite',
    items: [
      { key: 'sprite.name', label: 'Name', value: 'hero', source: 'custom' as const, kind: 'text' },
      { key: 'sheet.name', label: 'Sheet name', source: 'custom' as const, kind: 'text' },
    ],
  },
];

beforeEach(() => {
  reset();
  SETTINGS_SOURCES.project = fakeSource();
  SETTINGS_SOURCES.asset = fakeSource();
  fake.screens = structuredClone(SCREENS);
  fake.sourceStore.set('project.name', 'Dungeon');
  fake.sourceStore.set('sprite.name', 'hero');
});

describe('get_settings', () => {
  it('lists the app pages with values, and keeps the assistant and keymap values to itself', async () => {
    const seen = await ok('get_settings', { scope: 'app', schema: true });
    const items = (seen.pages as { sections: { items: Record<string, unknown>[] }[] }[])[0]?.sections[0]?.items ?? [];
    const by = (key: string) => items.find((item) => item.key === key);
    expect(by('gridSize')).toMatchObject({ value: 8, settable: true, locked: false, control: { kind: 'number', min: 1, max: 64 } });
    expect(by('assistantPrograms')).toMatchObject({ locked: true, why: expect.stringContaining('assistant') as string });
    expect(by('assistantPrograms')).not.toHaveProperty('value');
    expect(by('keymap')).not.toHaveProperty('value');
    expect(seen.routes).toEqual([{ route: 'settings', title: 'Settings', kind: 'screen' }]);
  });

  it('leaves control details out without schema and filters by page and keys', async () => {
    const seen = await ok('get_settings', { scope: 'app', page: 'Canvas', keys: ['theme'], schema: false });
    const pages = seen.pages as { sections: { items: Record<string, unknown>[] }[] }[];
    expect(pages).toHaveLength(1);
    expect(pages[0]?.sections[0]?.items).toEqual([{ key: 'theme', label: 'Theme', value: 'dark', settable: true, locked: false, why: null }]);
  });

  it('reads the project and the open asset, leaving out items of other asset kinds', async () => {
    const project = await ok('get_settings', { scope: 'project', schema: false });
    expect(JSON.stringify(project.pages)).toContain('"project.name"');
    const asset = await ok('get_settings', { scope: 'asset', schema: false });
    expect(JSON.stringify(asset.pages)).toContain('"sprite.name"');
    expect(JSON.stringify(asset.pages)).not.toContain('sheet.name');
  });
});

describe('set_setting', () => {
  it('writes an app setting through Brock and returns the stored value', async () => {
    const done = await ok('set_setting', { scope: 'app', key: 'gridSize', value: 16 });
    expect(done).toMatchObject({ scope: 'app', key: 'gridSize', shown: false });
    expect(fake.appSet).toEqual([['gridSize', 16]]);
    expect(fake.announced.at(-1)).toContain('changed Grid');
  });

  it('checks the value against the control before it writes', async () => {
    expect(await code('set_setting', { scope: 'app', key: 'gridSize', value: 999 })).toBe('SETTING_INVALID');
    expect(await code('set_setting', { scope: 'app', key: 'gridSize', value: 'big' })).toBe('SETTING_INVALID');
    expect(await code('set_setting', { scope: 'app', key: 'theme', value: 'blue' })).toBe('SETTING_INVALID');
    expect(await code('set_setting', { scope: 'app', key: 'nothing', value: 1 })).toBe('SETTING_INVALID');
    expect(fake.appSet).toEqual([]);
  });

  it('refuses every assistant and keymap key, in any case', async () => {
    for (const key of ['assistantPrograms', 'assistantLevel', 'AssistantAccess', 'keymap', 'keymapOverrides']) {
      expect(await code('set_setting', { scope: 'app', key, value: [] }), key).toBe('SETTING_PROTECTED');
    }
    expect(fake.appSet).toEqual([]);
  });

  it('writes a project and an asset setting through the page source and reads it back', async () => {
    const project = await ok('set_setting', { scope: 'project', key: 'project.name', value: 'Crypt' });
    expect(project.value).toBe('Crypt');
    openDocument();
    const asset = await ok('set_setting', { scope: 'asset', key: 'sprite.name', value: 'knight', show: true });
    expect(asset).toMatchObject({ value: 'knight', shown: true });
    expect(fake.opened).toEqual(['asset/sprite']);
    fake.fails.add('sprite.name');
    expect(await code('set_setting', { scope: 'asset', key: 'sprite.name', value: 'x' })).toBe('SETTING_INVALID');
  });

  it('answers a confirm dialog the owner left open, through set_view', async () => {
    fake.dialog = { id: 3, choices: ['confirm', 'cancel'] };
    expect((await ok('get_view', {})).dialog).toMatchObject({ id: 3 });
    expect(await code('set_view', { dialog: { answer: 'maybe' } })).toBe('VIEW_INVALID');
    expect(await ok('set_view', { dialog: { answer: 'cancel' } })).toMatchObject({ applied: ['dialog'] });
    expect(fake.calls).toEqual(['answer cancel']);
    fake.dialog = null;
    expect(await code('set_view', { dialog: { answer: 'cancel' } })).toBe('VIEW_INVALID');
    expect((await call('get_view', {})).ok).toBe(true);
  });
});
