/* @layer renderer-app @kind test */
import { PRESETS } from '@bxel/mcp';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useToolStore } from '../../src/stores/useToolStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { check } from './app-tools-check';
import { fake } from './app-tools-fake';
import { call, contextWith, openDocument, panTo, reset, setZoom, viewport } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok, code, valid } = check;

beforeEach(reset);

describe('get_view and zooming', () => {
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

});

describe('set_view state, selection and pages', () => {
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
    expect(seen.selection).toMatchObject({ pixels: 8, combine: 'replace' });
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
