/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { optionById } from '../../src/editor/tool-options/option-by-id';
import { OPTION_SPECS } from '../../src/editor/tool-options/option-specs.constants';
import { optionsOf } from '../../src/editor/tool-options/options-of';
import { resetAllTools } from '../../src/editor/tool-options/reset-all-tools';
import { resetTool } from '../../src/editor/tool-options/reset-tool';
import { setOption } from '../../src/editor/tool-options/set-option';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { optionGroups } from '../../src/keymap/option-groups';
import { OPTION_COMMAND } from '../../src/keymap/option-command-id.constants';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { SELECTION_DEFAULTS } from '../../src/stores/selection-store.constants';
import { resetEditor } from '../editor/option-harness';
import { findCommand } from '../keymap/find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const commandIds = new Set(APP_COMMANDS.map((def) => def.id));

const tools = () => useToolStore.getState();

beforeEach(() => {
  resetEditor();
  useSelectionStore.setState({ ...SELECTION_DEFAULTS });
});

describe('the option model coverage', () => {
  it('gives every option an id of its tool, a label, a description and a way to read and write it', () => {
    const ids = OPTION_SPECS.map((spec) => spec.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const spec of OPTION_SPECS) {
      expect(spec.label.trim()).not.toBe('');
      expect(spec.description.trim()).not.toBe('');
      expect(spec.id.startsWith(spec.surface === 'map' ? 'map.' : `${spec.tool}.`)).toBe(true);
      expect(typeof spec.read).toBe('function');
      expect(typeof spec.write).toBe('function');
    }
  });

  it('gives a number a range and a toggle or an action an icon', () => {
    for (const spec of OPTION_SPECS.filter((each) => each.kind === 'number')) expect(spec.min !== undefined && spec.max !== undefined).toBe(true);
    for (const spec of OPTION_SPECS.filter((each) => each.kind === 'toggle' || each.kind === 'action')) expect(spec.icon).toBeDefined();
  });

  it('gives a choice at least two described values and a default among them', () => {
    for (const spec of OPTION_SPECS.filter((each) => each.kind === 'choice')) {
      expect((spec.choices ?? []).length).toBeGreaterThan(1);
      expect(spec.choices?.some((choice) => choice.value === String(spec.default))).toBe(true);
      expect((spec.choices ?? []).every((choice) => choice.description.length > 5)).toBe(true);
    }
  });

  it('gives every paint option that is not an action a command, and every key row an existing command', () => {
    for (const spec of OPTION_SPECS.filter((each) => each.surface === 'paint' && each.kind !== 'action')) {
      const id = spec.command ?? `options.${spec.id}`;
      expect(commandIds.has(id)).toBe(true);
    }
    for (const spec of OPTION_SPECS) for (const row of spec.shortcuts ?? []) expect(commandIds.has(row.command)).toBe(true);
    for (const command of Object.values(OPTION_COMMAND)) expect(commandIds.has(command)).toBe(true);
    expect(optionGroups(OPTION_SPECS.filter((spec) => spec.surface === 'paint' && spec.kind !== 'action')).length).toBeGreaterThan(10);
  });

  it('shows a bar for every tool of a surface with the options of the old toolbar', () => {
    const names = (surface: 'sprite' | 'map', tool: Parameters<typeof optionsOf>[1]): string[] => optionsOf(surface, tool).map((spec) => spec.name);
    expect(names('sprite', 'pencil')).toEqual(['size', 'tip', 'pixel_perfect']);
    expect(names('sprite', 'eraser')).toEqual(['size', 'tip', 'pixel_perfect']);
    expect(names('sprite', 'fill')).toEqual(['area', 'neighbours']);
    expect(names('sprite', 'shape')).toEqual(['kind', 'filled', 'size', 'tip']);
    expect(names('sprite', 'select')).toEqual(['shape', 'mode', 'expand', 'shrink']);
    useSelectionStore.getState().setVariant('wand');
    expect(names('sprite', 'select')).toEqual(['shape', 'mode', 'neighbours', 'expand', 'shrink']);
    expect(names('sprite', 'picker')).toEqual([]);
    expect(names('map', 'pencil')).toEqual(['flip_x', 'flip_y', 'rotate', 'terrain']);
    expect(names('map', 'shape')).toEqual(['filled', 'flip_x', 'flip_y', 'rotate', 'terrain']);
    expect(names('map', 'select')).toEqual(['flip_x', 'flip_y', 'rotate', 'replace_in', 'replace_all', 'unique', 'clear']);
  });
});

describe('the option memory', () => {
  it('keeps one brush size per tool', () => {
    tools().setBrushSize(3);
    tools().selectTool('eraser');
    expect(tools().brushSize).toBe(1);
    tools().setBrushSize(5);
    tools().setBrushShape('circle');
    tools().selectTool('pencil');
    expect(tools()).toMatchObject({ brushSize: 3, brushShape: 'square' });
    tools().selectTool('eraser');
    expect(tools()).toMatchObject({ brushSize: 5, brushShape: 'circle' });
  });

  it('shares the brush between the tools when the setting is on', () => {
    tools().setShareBrush(true);
    tools().setBrushSize(4);
    tools().selectTool('eraser');
    expect(tools().brushSize).toBe(4);
  });

  it('reads and writes the value of a tool that is not active from its memory', () => {
    const size = optionById('shape.size');
    if (!size) throw new Error('no shape size');
    expect(setOption(size, 7)).toBe(true);
    expect(tools().brushSize).toBe(1);
    tools().selectTool('shape');
    expect(tools().brushSize).toBe(7);
  });

});

describe('the option commands', () => {
  it('sets any option by the options.set command and refuses a wrong value', async () => {
    const set = findCommand(OPTION_COMMAND.set);
    await set.run({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, args: { option: 'fill.area', value: 'global' } });
    expect(tools().fillMode).toBe('global');
    await set.run({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, args: { tool: 'select', option: 'mode', value: 'subtract' } });
    expect(useSelectionStore.getState().mode).toBe('subtract');
    await set.run({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, args: { option: 'fill.area', value: 'nonsense' } });
    expect(tools().fillMode).toBe('global');
    await set.run({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, args: { option: 'pencil.size', value: 900 } });
    tools().selectTool('pencil');
    expect(tools().brushSize).toBe(64);
  });

  it('toggles pixel perfect and cycles the tip with their commands for the active tool only', async () => {
    await findCommand(OPTION_COMMAND.pixelPerfect).run();
    expect(tools().pixelPerfect).toBe(true);
    await findCommand(OPTION_COMMAND.cycleTip).run();
    expect(tools().brushShape).toBe('circle');
    await findCommand(OPTION_COMMAND.sizeUpBy).run();
    expect(tools().brushSize).toBe(5);
  });

  it('resets one tool, then every tool', () => {
    tools().setBrushSize(9);
    useSelectionStore.getState().setMode('add');
    resetTool('pencil');
    expect(tools().brushSize).toBe(1);
    expect(useSelectionStore.getState().mode).toBe('add');
    tools().setFillMode('global');
    resetAllTools();
    expect(tools().fillMode).toBe('contiguous');
    expect(useSelectionStore.getState().mode).toBe('replace');
  });

  it('disables Filled for a line with the reason', () => {
    const filled = optionById('shape.filled');
    expect(filled?.disabledReason?.()).toBe('Lines have no inside.');
    tools().setShape('rect');
    expect(filled?.disabledReason?.()).toBeUndefined();
  });
});
