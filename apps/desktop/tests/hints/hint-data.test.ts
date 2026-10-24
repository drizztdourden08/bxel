/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { modeOf } from '../../src/editor/selection/mode-of';
import { SELECT_MODES } from '../../src/editor/selection/selection.constants';
import { statusItems } from '../../src/editor/status-items';
import { MODE_KEYS } from '../../src/editor/tool-descriptions.constants';
import { TOOLS } from '../../src/editor/tools.constants';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { TOOL_ICONS } from '../../src/icons/tool-icons.constants';
import { MAP_TOOLS } from '../../src/tilemap/map-tools.constants';
import { railItems } from '../../src/views/ToolRail/behavior/rail-items';
import type { RailItemContext } from '../../src/views/ToolRail/ToolRail.type';
import { canvasHelp } from '../../src/views/EditorStatus/behavior/canvas-help';
import { COMMON_ROWS, TOOL_ROWS } from '../../src/views/EditorStatus/EditorStatus.constants';
import { LAYER_ACTIONS } from '../../src/views/LayersPanel/LayersPanel.constants';
import { SPRITE_HINTS } from '../../src/views/SpritesPanel/SpritesPanel.constants';
import { TRANSFORM_ACTIONS } from '../../src/views/CanvasToolbar/sub-components/TransformMenu.constants';
import { allHints } from './all-hints';

vi.mock('@drizztdourden08/brock-react', async () => {
  const base = (await import('../keymap/brock-react-mock')).brockReactMock();
  const chords = (await import('./brock-chords')).brockChords();
  return { ...base, commands: { ...base.commands, ...chords.commands } };
});

const DASHES = /[–—]/;

describe('the hint texts', () => {
  it('give every hint a name and a one line description in plain prose', () => {
    for (const hint of allHints()) {
      expect(hint.name.trim()).not.toBe('');
      expect(hint.description.trim()).not.toBe('');
      expect(hint.description).not.toContain('\n');
      expect(DASHES.test(hint.name + hint.description)).toBe(false);
    }
  });

  it('point only at commands that exist in the keymap', () => {
    const ids = new Set(APP_COMMANDS.map((def) => def.id));
    const used = allHints().flatMap((hint) => hint.shortcuts ?? []).flatMap((shortcut) => shortcut.command ?? []);
    expect(used.length).toBeGreaterThan(20);
    expect(used.filter((command) => !ids.has(command))).toEqual([]);
  });

  it('keep the key out of the names of buttons', () => {
    const names = [...LAYER_ACTIONS.map((action) => action.hint.name), ...TRANSFORM_ACTIONS.map((action) => action.hint.name), ...Object.values(SPRITE_HINTS).map((hint) => hint.name)];
    for (const name of names) expect(name).not.toMatch(/[()+]|\b(Ctrl|Alt|Shift)\b/);
  });
});

describe('the tool rail', () => {
  it('names a tool button with the tool alone and puts the key in the hint', () => {
    const keys = { pencil: undefined, eraser: undefined, fill: undefined, picker: undefined, shape: undefined, zoom: undefined, hand: undefined, select: undefined, move: undefined };
    const context: RailItemContext = { defs: MAP_TOOLS, tool: 'pencil', pick: () => undefined, keys, options: {}, icons: TOOL_ICONS };
    const toggles = railItems(context).filter((item) => item.kind === 'toggle');
    expect(toggles.map((item) => item.label)).toEqual(MAP_TOOLS.map((def) => def.label));
    for (const item of toggles) expect(item.label).not.toMatch(/[()+]/);
  });

  it('lists every tool of the editor as a toggle named with the tool alone', () => {
    const keys = { pencil: undefined, eraser: undefined, fill: undefined, picker: undefined, shape: undefined, zoom: undefined, hand: undefined, select: undefined, move: undefined };
    const context: RailItemContext = { defs: TOOLS, tool: 'pencil', pick: () => undefined, keys, options: {}, icons: TOOL_ICONS };
    const toggles = railItems(context).filter((item) => item.kind === 'toggle');
    expect(toggles.map((item) => item.label).sort()).toEqual(TOOLS.map((def) => def.label).sort());
  });

  it('gives every tool a description', () => {
    for (const def of TOOLS) expect(def.description.length).toBeGreaterThan(10);
  });
});

describe('the selection mode keys', () => {
  it('match the keys the selection tool reads', () => {
    for (const mode of SELECT_MODES) {
      const keys = MODE_KEYS[mode];
      const held = { shiftKey: keys.includes('shift'), altKey: keys.includes('alt') };
      expect(modeOf(held, 'replace')).toBe(mode);
    }
  });
});

describe('the status bar help', () => {
  it('adds a help entry to the status bar', () => {
    const items = statusItems({ pointer: null, zoom: 1, colour: null, clean: true, recovered: false });
    expect(items.map((item) => item.id)).toContain('help');
  });

  it('lists the rows of the current tool before the rows for every tool', () => {
    for (const tool of TOOLS) {
      const help = canvasHelp(tool.id, 'sprite');
      expect(help.shortcuts).toEqual([...TOOL_ROWS[tool.id], ...COMMON_ROWS]);
      expect(help.description).toContain(tool.label);
    }
  });

  it('teaches the wheel, the middle button, Space and the straight line', () => {
    const rows = canvasHelp('pencil', 'sprite').shortcuts ?? [];
    const has = (label: string): boolean => rows.some((row) => row.label === label);
    expect(has('Zoom')).toBe(true);
    expect(has('Pan by dragging')).toBe(true);
    expect(has('Pan with the main button')).toBe(true);
    expect(has('Straight line')).toBe(true);
  });

  it('switches to the sheet rows in Sheet mode', () => {
    const sheet = canvasHelp('pencil', 'sheet');
    expect(sheet.description).toContain('sheet');
    expect(sheet.shortcuts?.some((row) => row.label === 'Select a range')).toBe(true);
  });
});
