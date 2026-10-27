/* @layer renderer-app @kind test */
import { buildTools, PRESETS } from '@bxel/mcp';
import type { Grant, ToolOutcome } from '@bxel/mcp';
import { documentCommands } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { actAs } from '../../src/documents/acting-as';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { call, contextWith, fake, openDocument, panTo, reset, setZoom, viewport } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const tools = buildTools(documentCommands);

const valid = (tool: string, outcome: ToolOutcome): ToolOutcome => {
  const checked = tools.find((candidate) => candidate.name === tool)?.output.safeParse(outcome);
  if (checked?.success !== true) throw new Error(`${tool} answered a shape the contract refuses: ${JSON.stringify(checked?.error?.issues)}`);
  return outcome;
};

const ok = async (tool: Parameters<typeof call>[0], input: unknown, grant?: Grant): Promise<Record<string, unknown>> => {
  const outcome = valid(tool, await call(tool, input, contextWith(grant)));
  if (!outcome.ok) throw new Error(`${tool} failed: ${outcome.error.message}`);
  return outcome;
};

const code = async (tool: Parameters<typeof call>[0], input: unknown, grant?: Grant): Promise<string> => {
  const outcome = await call(tool, input, contextWith(grant));
  return outcome.ok ? 'OK' : outcome.error.code;
};

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

describe('get_view and set_view', () => {
  it('reports the tool, colours and zoom of the window', async () => {
    const documentId = openDocument();
    useViewStore.getState().setViewport(viewport);
    const seen = await ok('get_view', {});
    expect(seen).toMatchObject({ window: 'visible', visible: true, tool: { id: 'pencil' }, colours: { foreground: 1 } });
    expect((seen.active as { documentId: string }).documentId).toBe(documentId);
    expect(seen.zoom).toMatchObject({ percent: 400, image: { width: 16, height: 16 } });
  });

  it('says it is not visible on a headless instance', async () => {
    const outcome = valid('get_view', await call('get_view', {}, contextWith(PRESETS.full_control.grant, 'headless')));
    expect(outcome).toMatchObject({ ok: true, visible: false, window: 'headless' });
  });

  it('zooms to a region and pans, with the viewport of the canvas', async () => {
    openDocument();
    useViewStore.getState().setViewport(viewport);
    await ok('set_view', { zoom: { rect: { x: 2, y: 2, width: 4, height: 8 } } });
    expect(setZoom).toHaveBeenCalledWith(16);
    expect(panTo).toHaveBeenCalledWith({ x: 4, y: 6 });
    await ok('set_view', { pan: { centreX: 3, centreY: 5 } });
    expect(panTo).toHaveBeenLastCalledWith({ x: 3, y: 5 });
    expect(await code('set_view', { zoom: 'fit' }, PRESETS.read_only.grant)).toBe('OK');
  });

  it('refuses a zoom with no canvas on screen', async () => {
    expect(await code('set_view', { zoom: 'fit' })).toBe('VIEW_INVALID');
  });

  it('flips the toggles, picks the tool and colours, and sets symmetry', async () => {
    openDocument();
    const done = await ok('set_view', {
      toggles: { grid: true, tiled: 'both' },
      tool: { id: 'fill', options: { brushSize: 3, filled: true } },
      colours: { foreground: 2, background: 1 },
      symmetry: { x: true, axisX: 8 },
    });
    expect(done.applied).toEqual(['toggles', 'tool', 'colours', 'symmetry']);
    expect(useViewStore.getState()).toMatchObject({ grid: true, tiled: 'both' });
    expect(useToolStore.getState()).toMatchObject({ tool: 'fill', brushSize: 3, filled: true, foreground: 2, background: 1, symmetryX: true, axisX: 8 });
    expect(fake.announced.at(-1)).toContain('changed the view');
  });

  it('refuses a colour outside the palette, and the state fields at Read', async () => {
    openDocument();
    expect(await code('set_view', { colours: { foreground: 200 } })).toBe('VIEW_INVALID');
    expect(await code('set_view', { colours: { foreground: 1 } }, PRESETS.read_only.grant)).toBe('OK');
  });

  it('selects a rectangle, adds a wand region and returns the mask as row runs', async () => {
    openDocument();
    const first = await ok('set_view', { selection: { shape: { kind: 'rect', rect: { x: 1, y: 1, width: 3, height: 2 } } } });
    expect(first.selection).toMatchObject({ empty: false, pixels: 6, bounds: { x: 1, y: 1, width: 3, height: 2 }, runs: [[1, 1, 3], [2, 1, 3]] });
    const added = await ok('set_view', { selection: { op: 'add', shape: { kind: 'rects', rects: [{ x: 8, y: 8, width: 2, height: 1 }] } } });
    expect((added.selection as { pixels: number }).pixels).toBe(8);
    const seen = await ok('get_view', {});
    expect(seen.selection).toMatchObject({ pixels: 8, variant: expect.any(String) });
    const runs = await ok('set_view', { selection: { op: 'replace', shape: { kind: 'runs', runs: [[0, 0, 1]] } } });
    expect(runs.selection).toMatchObject({ pixels: 2 });
    const wand = await ok('set_view', { selection: { shape: { kind: 'wand', x: 0, y: 0, connectivity: 4 } } });
    expect((wand.selection as { pixels: number }).pixels).toBeGreaterThan(0);
    const cleared = await ok('set_view', { selection: { shape: { kind: 'none' } } });
    expect(cleared.selection).toMatchObject({ empty: true, pixels: 0, runs: null });
  });

  it('refuses a wand outside the sprite and a focus on an unknown tab', async () => {
    openDocument();
    expect(await code('set_view', { selection: { shape: { kind: 'wand', x: 99, y: 0, connectivity: 4 } } })).toBe('VIEW_INVALID');
    expect(await code('set_view', { focus: { tabId: 'nope', raise: false } })).toBe('VIEW_INVALID');
  });

  it('opens a page that exists and refuses one that does not', async () => {
    expect(await code('set_view', { page: { route: 'settings' } })).toBe('OK');
    expect(fake.opened).toEqual(['settings']);
    expect(await code('set_view', { page: { route: 'nowhere' } })).toBe('VIEW_INVALID');
  });
});

const programEdit = (documentId: string, label: string) => {
  const { host } = useDocumentStore.getState();
  const view = host.view(documentId as never);
  if (!view) throw new Error('no view');
  return actAs({ actor: 's1', label: (text) => `Assistant (Check): ${text}` }, () =>
    host.execute({ documentId: documentId as never, baseRevision: view.state.revision, mode: 'commit', origin: 'ui', actor: 'owner', label, steps: [{ name: 'sprite.create', targets: null, options: { name: label, width: 4, height: 4 } }] as never, previewPixels: 0 }),
  );
};

const revisionOf = (documentId: string): number => useDocumentStore.getState().host.view(documentId as never)?.state.revision ?? 0;

describe('undo with redo and get_history', () => {
  it('attributes a change made while acting as the program, lists it, undoes it and redoes it', async () => {
    const documentId = openDocument();
    expect((await programEdit(documentId, 'Draw')).ok).toBe(true);
    const listed = await ok('get_history', { documentId, limit: 50 });
    expect(listed).toMatchObject({ total: 1, cursor: 1, canUndo: true, canRedo: false });
    expect((listed.entries as Record<string, unknown>[])[0]).toMatchObject({ actor: 'Check', origin: 'mcp', applied: true, label: 'Assistant (Check): Draw' });
    const undone = await ok('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'undo', steps: 1 });
    expect(undone).toMatchObject({ direction: 'undo', count: 1, undone: { origin: 'mcp' } });
    const mid = await ok('get_history', { documentId, limit: 50 });
    expect(mid).toMatchObject({ cursor: 0, canRedo: true, canUndo: false });
    expect((mid.entries as { applied: boolean }[])[0]?.applied).toBe(false);
    const redone = await ok('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'redo', steps: 1 });
    expect(redone).toMatchObject({ direction: 'redo', count: 1 });
    expect(await ok('get_history', { documentId, limit: 50 })).toMatchObject({ cursor: 1, canRedo: false });
    expect(await code('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'redo', steps: 1 })).toBe('NOTHING_TO_REDO');
  });

  it('undoes several steps of its own and stops at an entry that is not its own', async () => {
    const documentId = openDocument();
    const { host } = useDocumentStore.getState();
    host.execute({ documentId: documentId as never, baseRevision: revisionOf(documentId), mode: 'commit', origin: 'ui', actor: 'owner', label: 'Owner edit', steps: [{ name: 'sprite.create', targets: null, options: { name: 'mine', width: 4, height: 4 } }] as never, previewPixels: 0 });
    await programEdit(documentId, 'One');
    await programEdit(documentId, 'Two');
    const done = await ok('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'undo', steps: 5 });
    expect(done).toMatchObject({ count: 2 });
    expect(await code('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'undo', steps: 1 })).toBe('UNDO_NOT_OWN');
    const history = await ok('get_history', { documentId, limit: 5 });
    expect((history.entries as { actor: string }[])[0]?.actor).toBe('owner');
  });
});
