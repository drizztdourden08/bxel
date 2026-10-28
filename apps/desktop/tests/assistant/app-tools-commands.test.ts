/* @layer renderer-app @kind test */
import { PRESETS } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { check } from './app-tools-check';
import { fake } from './app-tools-fake';
import { call, contextWith, openDocument, reset } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok, code } = check;

beforeEach(reset);

describe('list_commands', () => {
  it('lists the commands with their area, effect, chord and why one is off', async () => {
    fake.commands = [
      { id: 'view.zoom_in', label: 'Zoom in' },
      { id: 'timeline.add_frame', label: 'Add a frame', enabled: false, reason: 'No animation is open.' },
      { id: 'transform.rotate', label: 'Rotate...' },
    ];
    const listed = (await ok('list_commands', { includeDisabled: true })).commands as Record<string, unknown>[];
    const row = (id: string) => listed.find((each) => each.id === id);
    expect(row('view.zoom_in')).toMatchObject({ area: 'app_control', effect: 'show', chord: 'Mod+K', enabled: true, reason: null, opensDialog: false });
    expect(row('timeline.add_frame')).toMatchObject({ area: 'animation', effect: 'edit', enabled: false, reason: 'No animation is open.' });
    expect(row('transform.rotate')).toMatchObject({ opensDialog: true });
    expect((row('transform.rotate')?.args as { properties: object }).properties).toHaveProperty('angle');
  });

  it('filters by area and query, and hides disabled commands on request', async () => {
    fake.commands = [
      { id: 'view.zoom_in', label: 'Zoom in' },
      { id: 'timeline.add_frame', label: 'Add a frame', enabled: false },
    ];
    expect(((await ok('list_commands', { area: 'animation', includeDisabled: true })).commands as unknown[]).length).toBe(1);
    expect(((await ok('list_commands', { query: 'zoom', includeDisabled: true })).commands as unknown[]).length).toBe(1);
    expect(((await ok('list_commands', { includeDisabled: false })).commands as unknown[]).length).toBe(1);
  });

  it('leaves out the commands of a Disabled bundle', async () => {
    fake.commands = [
      { id: 'view.zoom_in', label: 'Zoom in' },
      { id: 'timeline.add_frame', label: 'Add a frame' },
    ];
    const grant: Grant = { ...PRESETS.full_control.grant, bundles: { ...PRESETS.full_control.grant.bundles, animation: 'disabled' } };
    const listed = (await ok('list_commands', { includeDisabled: true }, grant)).commands as { id: string }[];
    expect(listed.map((each) => each.id)).toEqual(['view.zoom_in']);
  });
});

describe('run_command', () => {
  it('runs a command with the assistant trigger and says it in the status line', async () => {
    fake.commands = [{ id: 'view.zoom_in', label: 'Zoom in' }];
    const done = await ok('run_command', { id: 'view.zoom_in', show: false });
    expect(done).toMatchObject({ ran: true, id: 'view.zoom_in', label: 'Zoom in', opened: null });
    expect((fake.commands[0]?.ran?.[0] as { trigger: string }).trigger).toBe('assistant');
    expect(fake.announced).toEqual(['Check: Zoom in']);
  });

  it('refuses an unknown id, a disabled command, undo and bad args', async () => {
    fake.commands = [
      { id: 'timeline.add_frame', label: 'Add a frame', enabled: false, reason: 'No animation is open.' },
      { id: 'history.undo', label: 'Undo' },
      { id: 'layer.toggle_visible', label: 'Show or hide layer' },
    ];
    expect(await code('run_command', { id: 'nope', show: false })).toBe('COMMAND_UNKNOWN');
    expect(await code('run_command', { id: 'timeline.add_frame', show: false })).toBe('COMMAND_OFF');
    expect(await code('run_command', { id: 'history.undo', show: false })).toBe('COMMAND_REFUSED');
    expect(await code('run_command', { id: 'layer.toggle_visible', args: { nope: 1 }, show: false })).toBe('COMMAND_ARGS');
    expect(fake.commands.every((command) => command.ran === undefined)).toBe(true);
  });

  it('runs only show commands at Read and names the bundle for the others', async () => {
    fake.commands = [
      { id: 'view.zoom_in', label: 'Zoom in' },
      { id: 'layer.add', label: 'New layer' },
    ];
    const grant = PRESETS.edit_documents.grant;
    expect((await ok('run_command', { id: 'view.zoom_in', show: false }, grant)).ran).toBe(true);
    const refused = await call('run_command', { id: 'layer.add', show: false }, contextWith(grant));
    expect(refused).toMatchObject({ ok: false, error: { code: 'READ_LEVEL' } });
    expect(JSON.stringify(refused)).toContain('App control is set to Read');
  });

  it('takes the lower of the tool and the bundle of the command', async () => {
    fake.commands = [{ id: 'timeline.add_frame', label: 'Add a frame' }];
    const grant: Grant = { ...PRESETS.full_control.grant, bundles: { ...PRESETS.full_control.grant.bundles, animation: 'read' } };
    expect(await code('run_command', { id: 'timeline.add_frame', show: false }, grant)).toBe('READ_LEVEL');
  });

});

describe('run_command dialogs and revisions', () => {
  it('never blocks on a dialog: a dialog command without args is a plain input error, with show it opens', async () => {
    fake.commands = [{ id: 'file.open', label: 'Open file' }];
    expect(await code('run_command', { id: 'file.open', show: false })).toBe('COMMAND_ARGS');
    expect(fake.commands[0]?.ran).toBeUndefined();
    const shown = await ok('run_command', { id: 'file.open', show: true });
    expect(shown).toMatchObject({ ran: false, opened: 'dialog:file' });
    expect(fake.commands[0]?.ran).toHaveLength(1);
  });

  it('rotates by 45 with args straight away, without the dialog and without running the command', async () => {
    fake.commands = [{ id: 'transform.rotate', label: 'Rotate...' }];
    openDocument();
    const done = await ok('run_command', { id: 'transform.rotate', args: { angle: 45 }, show: false });
    expect(done).toMatchObject({ ran: true, opened: null });
    expect(fake.commands[0]?.ran).toBeUndefined();
    expect(await code('run_command', { id: 'transform.rotate', args: { angle: 'a lot' }, show: false })).toBe('COMMAND_ARGS');
  });

  it('opens the dialog for the owner with show, prefilled', async () => {
    fake.commands = [{ id: 'transform.scale', label: 'Scale...' }];
    openDocument();
    const shown = await ok('run_command', { id: 'transform.scale', args: { width: 8, height: 8 }, show: true });
    expect(shown).toMatchObject({ ran: false, opened: 'dialog:scale' });
    expect(usePendingStore.getState().pending?.spec).toMatchObject({ kind: 'scale', width: 8, height: 8 });
    expect(fake.commands[0]?.ran).toBeUndefined();
  });

  it('refuses an editing command when the revision is stale', async () => {
    fake.commands = [{ id: 'layer.add', label: 'New layer' }];
    openDocument();
    expect(await code('run_command', { id: 'layer.add', revision: 999, show: false })).toBe('STALE_REVISION');
  });
});
