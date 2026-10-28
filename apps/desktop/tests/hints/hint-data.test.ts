/* @layer renderer-app @kind test */
import { columnContext } from '../ui-context/columns';
import { describe, expect, it, vi } from 'vitest';
import { modeOf } from '../../src/editor/selection/mode-of';
import { SELECT_MODES } from '../../src/editor/selection/selection.constants';
import { statusItems } from '../../src/editor/status-items';
import { MODE_KEYS } from '../../src/editor/tool-descriptions.constants';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import { TOOL_SLOTS } from '../../src/editor/tool-catalogue/tool-catalogue.constants';
import { toolIds } from '../../src/editor/tool-catalogue/tool-ids';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { railOf } from '../ui-context/rail-of';
import { canvasHelp } from '../../src/views/EditorStatus/behavior/canvas-help';
import { COMMON_ROWS, TOOL_ROWS } from '../../src/views/EditorStatus/EditorStatus.constants';
import { LAYER_BAR_HINTS } from '../../src/views/LayerStack/LayerStack.constants';
import { SPRITE_HINTS } from '../../src/views/SpritesPanel/SpritesPanel.constants';
import { CANVAS_ACTIONS, TRANSFORM_ACTIONS } from '../../src/views/CanvasToolbar/sub-components/TransformMenu.constants';
import { allHints } from './all-hints';

vi.mock('@drizztdourden08/brock-react', async () => {
  const base = (await import('../keymap/brock-react-mock')).brockReactMock();
  const chords = (await import('./brock-chords')).brockChords();
  return { ...base, commands: { ...base.commands, ...chords.commands } };
});

const DASHES = /[–—]/;

const BROCK_COMMANDS = ['brock.region.next'];

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
    const ids = new Set([...APP_COMMANDS.map((def) => def.id), ...BROCK_COMMANDS]);
    const used = allHints().flatMap((hint) => hint.shortcuts ?? []).flatMap((shortcut) => shortcut.command ?? []);
    expect(used.length).toBeGreaterThan(20);
    expect(used.filter((command) => !ids.has(command))).toEqual([]);
  });

  it('keep the key out of the names of buttons', () => {
    const names = [...Object.values(LAYER_BAR_HINTS).map((hint) => hint.name), ...TRANSFORM_ACTIONS.map((action) => action.hint.name), ...CANVAS_ACTIONS.map((action) => action.hint.name), ...Object.values(SPRITE_HINTS).map((hint) => hint.name)];
    for (const name of names) expect(name).not.toMatch(/[()+]|\b(Ctrl|Alt|Shift)\b/);
  });
});

describe('the tool rail', () => {
  it('names a map tool button with the tool alone and puts the key in the hint', () => {
    const toggles = railOf('Tm').filter((item) => item.kind === 'toggle');
    expect(toggles.map((item) => item.label)).toEqual(slotsOf('map').map((slot) => slot.label));
    for (const item of toggles) expect(item.label).not.toMatch(/[()+]/);
  });

  it('lists every tool of the editor as a toggle named with the slot and its current member', () => {
    const toggles = railOf('Sp').filter((item) => item.kind === 'toggle');
    expect(toggles).toHaveLength(slotsOf('sprite').length);
    expect(toggles.map((item) => item.label)).toContain('Shapes, Line');
    expect(toggles.map((item) => item.label)).toContain('Select, Rectangle');
  });

  it('gives every tool a description', () => {
    for (const slot of TOOL_SLOTS) for (const member of slot.members) expect(member.description.length).toBeGreaterThan(10);
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
    const items = statusItems({ pointer: null, zoom: 1, colours: [null, null], clean: true, recovered: false, context: columnContext('Sp'), tile: null });
    expect(items.map((item) => item.id)).toContain('help');
  });

  it('lists the rows of the current tool before the rows for every tool', () => {
    for (const tool of toolIds()) {
      const help = canvasHelp(tool, 'sprite');
      expect(help.shortcuts).toEqual([...TOOL_ROWS[tool], ...COMMON_ROWS]);
      expect(help.description).toContain(slotsOf('sprite').find((slot) => slot.tool === tool)?.label ?? tool);
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
