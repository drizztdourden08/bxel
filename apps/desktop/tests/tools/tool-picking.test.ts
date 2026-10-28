/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { allPresets } from '../../src/editor/presets/all-presets';
import { applyPreset } from '../../src/editor/presets/apply-preset';
import { BUILTIN_PRESETS } from '../../src/editor/presets/builtin-presets.constants';
import { matchingPreset } from '../../src/editor/presets/matching-preset';
import { presetsOfTool } from '../../src/editor/presets/presets-of-tool';
import { quickPresets } from '../../src/editor/presets/quick-presets';
import { saveDraft } from '../../src/editor/presets/save-draft';
import { applyOptionSnapshot } from '../../src/editor/tool-options/apply-option-snapshot';
import { optionSnapshot } from '../../src/editor/tool-options/option-snapshot';
import { parsePrefs } from '../../src/editor/tool-options/parse-prefs';
import { parseOptionValues } from '../../src/editor/tool-options/parse-option-values';
import { parsePresets } from '../../src/editor/tool-options/parse-presets';
import { TOOL_COMMAND } from '../../src/keymap/option-command-id.constants';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { selectionStore } from './selection-reset';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useToolPresetStore } from '../../src/stores/useToolPresetStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { resetEditor } from '../editor/option-harness';
import { findCommand } from '../keymap/find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const tools = () => useToolStore.getState();

beforeEach(() => {
  resetEditor();
  selectionStore();
  useToolPresetStore.setState({ user: [], draft: null });
});

describe('the tool keys', () => {
  it('cycles the six selection shapes with M and back with Shift+M', async () => {
    await findCommand(COMMAND_ID.tool('select')).run();
    expect(tools().tool).toBe('select');
    expect(useSelectionStore.getState().variant).toBe('rect');
    await findCommand(COMMAND_ID.tool('select')).run();
    expect(useSelectionStore.getState().variant).toBe('ellipse');
    await findCommand(COMMAND_ID.tool('select')).run();
    expect(useSelectionStore.getState().variant).toBe('lasso');
    await findCommand(TOOL_COMMAND.cycleBack('select')).run();
    await findCommand(TOOL_COMMAND.cycleBack('select')).run();
    expect(useSelectionStore.getState().variant).toBe('rect');
    await findCommand(TOOL_COMMAND.cycleBack('select')).run();
    expect(useSelectionStore.getState().variant).toBe('colour');
  });

  it('cycles the shape kind with U and the fill area with G', async () => {
    await findCommand(COMMAND_ID.tool('shape')).run();
    await findCommand(COMMAND_ID.tool('shape')).run();
    expect(tools().shape).toBe('rect');
    await findCommand(TOOL_COMMAND.cycleBack('shape')).run();
    expect(tools().shape).toBe('line');
    await findCommand(COMMAND_ID.tool('fill')).run();
    await findCommand(COMMAND_ID.tool('fill')).run();
    expect(tools().fillMode).toBe('global');
  });

  it('swaps the last two tools with the previous tool command', async () => {
    tools().setTool('eraser');
    tools().setTool('fill');
    expect(tools().previousTool).toBe('eraser');
    await findCommand(TOOL_COMMAND.previous).run();
    expect(tools().tool).toBe('eraser');
    await findCommand(TOOL_COMMAND.previous).run();
    expect(tools().tool).toBe('fill');
  });

  it('remembers the last five members per surface and keeps them apart', () => {
    for (const member of ['a', 'b', 'c', 'd', 'e', 'f']) tools().recordMember(member);
    expect(tools().recentMembers.paint).toEqual(['f', 'e', 'd', 'c', 'b']);
    tools().recordMember('d');
    expect(tools().recentMembers.paint.slice(0, 2)).toEqual(['d', 'f']);
    expect(tools().recentMembers.map).toEqual([]);
  });
});

describe('the tool of each surface', () => {
  it('restores the tool of a sprite after a visit to a map and the sheet', () => {
    tools().setTool('move');
    tools().enterSurface('map');
    expect(tools().tool).toBe('pencil');
    tools().setTool('fill');
    tools().enterSurface('sheet');
    expect(tools().tool).toBe('hand');
    tools().enterSurface('sprite');
    expect(tools().tool).toBe('move');
    tools().enterSurface('map');
    expect(tools().tool).toBe('fill');
  });

  it('keeps the tool while a tile and a sprite share the paint tools and with no document', () => {
    tools().setTool('select');
    tools().enterSurface('tile');
    tools().enterSurface('none');
    expect(tools().tool).toBe('select');
  });
});

describe('the presets', () => {
  it('ships the built ins and applies one with its member and fields', () => {
    expect(BUILTIN_PRESETS.map((preset) => preset.name)).toHaveLength(6);
    const three = BUILTIN_PRESETS.find((preset) => preset.id === 'builtin.pencil-3');
    if (!three) throw new Error('no preset');
    tools().setTool('fill');
    expect(applyPreset(three)).toBe(true);
    expect(tools()).toMatchObject({ tool: 'pencil', brushSize: 3, brushShape: 'circle', pixelPerfect: false });
    expect(matchingPreset(presetsOfTool(allPresets([]), 'pencil'), 'pencil')?.id).toBe('builtin.pencil-3');
  });

  it('stores only the ticked fields and leaves the others alone when applied', () => {
    tools().setBrushSize(6);
    tools().setBrushShape('circle');
    const saved = saveDraft({ member: 'pencil', name: 'Six', ticked: ['pencil.size'] });
    expect(saved?.fields).toEqual({ 'pencil.size': 6 });
    tools().setBrushSize(2);
    tools().setBrushShape('square');
    if (saved) applyPreset(saved);
    expect(tools()).toMatchObject({ brushSize: 6, brushShape: 'square' });
  });

  it('refuses an empty name or no ticked field and never overwrites a built in', () => {
    expect(saveDraft({ member: 'pencil', name: ' ', ticked: ['pencil.size'] })).toBeNull();
    expect(saveDraft({ member: 'pencil', name: 'x', ticked: [] })).toBeNull();
    const copy = saveDraft({ member: 'pencil', name: 'Mine', ticked: ['pencil.size'], replaces: 'builtin.pencil-1' });
    expect(copy?.id).not.toBe('builtin.pencil-1');
    expect(BUILTIN_PRESETS).toHaveLength(6);
  });

  it('answers Alt+1 to Alt+5 with the first five presets of the active tool', async () => {
    tools().setTool('pencil');
    expect(quickPresets('pencil').map((preset) => preset.id)).toEqual(['builtin.pencil-1', 'builtin.pencil-2', 'builtin.pencil-3']);
    await findCommand(TOOL_COMMAND.quickPreset(2)).run();
    expect(tools().brushSize).toBe(2);
    expect(findCommand(TOOL_COMMAND.quickPreset(5)).when?.()).toBe(false);
  });

  it('applies a preset by id with the apply preset command', async () => {
    await findCommand(TOOL_COMMAND.applyPreset).run({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, args: { id: 'builtin.fill-global' } });
    expect(tools()).toMatchObject({ tool: 'fill', fillMode: 'global' });
  });
});

describe('the saved values', () => {
  it('survive a restart through the snapshot', () => {
    tools().setBrushSize(4);
    tools().setTool('eraser');
    tools().setBrushSize(8);
    tools().setFillMode('global');
    const saved = JSON.parse(JSON.stringify(optionSnapshot())) as unknown;
    useToolStore.setState({ ...TOOL_DEFAULTS });
    applyOptionSnapshot(parseOptionValues(saved));
    expect(tools()).toMatchObject({ tool: 'pencil', brushSize: 4, fillMode: 'global' });
    tools().setTool('eraser');
    expect(tools().brushSize).toBe(8);
  });

  it('read only valid presets and preferences from the settings', () => {
    expect(parsePresets([{ id: 'a', name: 'A', member: 'pencil', fields: { 'pencil.size': 2, bad: {} } }, 5, { id: 1 }])).toEqual([
      { id: 'a', name: 'A', member: 'pencil', fields: { 'pencil.size': 2 } },
    ]);
    expect(parsePrefs({ holdMs: 5000, openOnHover: true })).toMatchObject({ holdMs: 800, openOnHover: true, showKeys: false, hiddenMembers: [] });
    expect(parsePrefs(undefined).shareBrush).toBe(false);
  });
});
