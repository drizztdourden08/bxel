/* @layer renderer-app @kind test */
import { shortcutsHelp } from '@drizztdourden08/brock-react';
import type { CommandDef } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { currentTarget } from '../../src/editor/current-target';
import { TOOLS } from '../../src/editor/tools.constants';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { COMMAND_ID, EDITOR_SCOPE } from '../../src/keymap/keymap.constants';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { VIEW_DEFAULTS } from '../../src/stores/view-store.constants';
import type { PixelView, PixelViewportHandle } from '../../src/views/PixelViewport';

vi.mock('@drizztdourden08/brock-react', () => ({
  shortcutsHelp: { open: vi.fn() },
  toast: vi.fn(),
  commands: { run: vi.fn() },
  getPlatform: vi.fn(),
  useRecentDocumentsStore: { getState: vi.fn() },
}));

const BROCK_CHORDS = ['mod+k', 'mod+/', 'alt+enter', 'alt+left'];

const chordsOf = (def: CommandDef): string[] => {
  if (def.chord === undefined) return [];
  if (typeof def.chord === 'string') return [def.chord];
  return 'mac' in def.chord ? [] : [...def.chord];
};

const canonical = (chord: string): string => {
  const parts = chord.split('+').map((part) => part.toLowerCase().replace('mod', 'ctrl'));
  const key = parts.pop() ?? '';
  return [...parts.sort(), key].join('+');
};

const pairsOf = (def: CommandDef): { id: string; key: string }[] => chordsOf(def).map((chord) => ({ id: def.id, key: canonical(chord) }));

const find = (id: string): CommandDef => {
  const def = APP_COMMANDS.find((each) => each.id === id);
  if (!def) throw new Error(`no command ${id}`);
  return def;
};

const run = (id: string): void => find(id).run();

const fakeView = (): PixelView => ({
  zoom: 1,
  pan: { x: 0, y: 0 },
  originX: 0,
  originY: 0,
  width: 0,
  height: 0,
  dpr: 1,
  imageWidth: 0,
  imageHeight: 0,
});

const fakeHandle = (): PixelViewportHandle => ({
  screenToPixel: vi.fn(() => ({ x: 0, y: 0 })),
  pixelToScreen: vi.fn(() => ({ x: 0, y: 0 })),
  fit: vi.fn(),
  setZoom: vi.fn(),
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  redraw: vi.fn(),
  view: fakeView,
});

beforeEach(() => {
  useToolStore.setState({ ...TOOL_DEFAULTS });
  useViewStore.setState({ ...VIEW_DEFAULTS });
  createDefaultArtwork(useDocumentStore.getState().host);
});

describe('the keymap table', () => {
  it('has no two commands on the same chord, and none on a Brock chord', () => {
    const owners = new Map<string, string[]>(BROCK_CHORDS.map((chord) => [chord, ['brock']]));
    const pairs = APP_COMMANDS.flatMap(pairsOf);
    for (const pair of pairs) owners.set(pair.key, [...(owners.get(pair.key) ?? []), pair.id]);
    const clashes = [...owners].filter(([, ids]) => ids.length > 1);
    expect(clashes).toEqual([]);
  });

  it('has a unique id, a label and a group for every command', () => {
    const ids = APP_COMMANDS.map((def) => def.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(APP_COMMANDS.every((def) => def.label !== '' && def.group !== undefined)).toBe(true);
  });

  it('puts every tool on its letter key', () => {
    const letters = TOOLS.map((tool) => chordsOf(find(COMMAND_ID.tool(tool.id))));
    expect(letters).toEqual([['B'], ['E'], ['G'], ['I'], ['U'], ['Z'], ['H'], ['M'], ['V']]);
  });

  it('keeps the chords of the contract for brush, symmetry, colours, view and help', () => {
    expect(chordsOf(find(COMMAND_ID.brushSmaller))).toEqual(['[']);
    expect(chordsOf(find(COMMAND_ID.brushLarger))).toEqual([']']);
    expect(chordsOf(find(COMMAND_ID.symmetryX))).toEqual(['Alt+X']);
    expect(chordsOf(find(COMMAND_ID.symmetryY))).toEqual(['Alt+Y']);
    expect(chordsOf(find(COMMAND_ID.swapColours))).toEqual(['X']);
    expect(chordsOf(find(COMMAND_ID.colourBack))).toEqual(['Q']);
    expect(chordsOf(find(COMMAND_ID.colourForward))).toEqual(['W']);
    expect(chordsOf(find(COMMAND_ID.zoomIn))).toEqual(['Plus', '=']);
    expect(chordsOf(find(COMMAND_ID.zoomOut))).toEqual(['Minus']);
    expect(chordsOf(find(COMMAND_ID.zoomFit))).toEqual(['Mod+0']);
    expect(chordsOf(find(COMMAND_ID.zoomActual))).toEqual(['Mod+1']);
    expect(chordsOf(find(COMMAND_ID.pixelGrid))).toEqual(["Mod+'"]);
    expect(chordsOf(find(COMMAND_ID.shortcuts))).toEqual(['F1']);
    expect(chordsOf(find(COMMAND_ID.undo))).toEqual(['Mod+Z']);
    expect(chordsOf(find(COMMAND_ID.redo))).toEqual(['Mod+Y', 'Mod+Shift+Z']);
  });

  it('scopes the editor commands to the editor screen and gates them on an open document', () => {
    const scoped = APP_COMMANDS.filter((def) => def.scope === EDITOR_SCOPE);
    expect(scoped.length).toBeGreaterThan(30);
    expect(find(COMMAND_ID.tool('pencil')).when?.()).toBe(true);
    useDocumentStore.getState().setActive(null);
    expect(find(COMMAND_ID.tool('pencil')).when?.()).toBe(false);
  });
});

describe('the tool, brush and colour commands', () => {
  it('select a tool, and cycle the shape kinds on a second press', () => {
    run(COMMAND_ID.tool('shape'));
    run(COMMAND_ID.tool('shape'));
    expect(useToolStore.getState()).toMatchObject({ tool: 'shape', shape: 'rect' });
    run(COMMAND_ID.tool('eraser'));
    expect(useToolStore.getState().tool).toBe('eraser');
  });

  it('change the brush size with the bracket commands', () => {
    run(COMMAND_ID.brushLarger);
    run(COMMAND_ID.brushLarger);
    expect(useToolStore.getState().brushSize).toBe(3);
    run(COMMAND_ID.brushSmaller);
    expect(useToolStore.getState().brushSize).toBe(2);
  });

  it('toggle symmetry and swap or step the colours', () => {
    run(COMMAND_ID.symmetryX);
    run(COMMAND_ID.symmetryY);
    run(COMMAND_ID.symmetryY);
    expect(useToolStore.getState()).toMatchObject({ symmetryX: true, symmetryY: false });
    useToolStore.getState().setForeground(4);
    useToolStore.getState().setBackground(7);
    run(COMMAND_ID.swapColours);
    expect(useToolStore.getState()).toMatchObject({ foreground: 7, background: 4 });
    run(COMMAND_ID.colourForward);
    run(COMMAND_ID.colourBack);
    run(COMMAND_ID.colourBack);
    expect(useToolStore.getState().foreground).toBe(6);
  });
});

describe('the view, layer and help commands', () => {
  it('toggle the pixel grid and set the tiled preview', () => {
    run(COMMAND_ID.pixelGrid);
    expect(useViewStore.getState().grid).toBe(false);
    run(COMMAND_ID.tiledBoth);
    expect(useViewStore.getState().tiled).toBe('both');
    run(COMMAND_ID.tiledX);
    expect(useViewStore.getState().tiled).toBe('x');
    run(COMMAND_ID.tiledOff);
    expect(useViewStore.getState().tiled).toBe('off');
  });

  it('drive the viewport for zoom in, out, fit and actual size', () => {
    const handle = fakeHandle();
    useViewStore.getState().setViewport(handle);
    run(COMMAND_ID.zoomIn);
    run(COMMAND_ID.zoomOut);
    run(COMMAND_ID.zoomFit);
    run(COMMAND_ID.zoomActual);
    expect(handle.zoomIn).toHaveBeenCalledTimes(1);
    expect(handle.zoomOut).toHaveBeenCalledTimes(1);
    expect(handle.fit).toHaveBeenCalledTimes(1);
    expect(handle.setZoom).toHaveBeenCalledWith(1);
  });

  it('open the shortcut list from the help command', () => {
    run(COMMAND_ID.shortcuts);
    expect(shortcutsHelp.open).toHaveBeenCalledTimes(1);
  });

  it('add a layer and step to the one below', () => {
    run(COMMAND_ID.layerAdd);
    expect(currentTarget()?.layer.name).toBe('Layer 2');
    run(COMMAND_ID.layerBelow);
    expect(currentTarget()?.layer.name).toBe('Layer 1');
    run(COMMAND_ID.layerAbove);
    expect(currentTarget()?.layer.name).toBe('Layer 2');
  });
});
