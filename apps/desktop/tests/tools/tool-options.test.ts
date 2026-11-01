/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { optionById } from '../../src/editor/tool-options/option-by-id';
import { optionsOf } from '../../src/editor/tool-options/options-of';
import { resetAllTools } from '../../src/editor/tool-options/reset-all-tools';
import { resetTool } from '../../src/editor/tool-options/reset-tool';
import { setOption } from '../../src/editor/tool-options/set-option';
import { OPTION_COMMAND } from '../../src/keymap/option-command-id.constants';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { SELECTION_DEFAULTS } from '../../src/stores/selection-store.constants';
import { resetEditor } from '../editor/option-harness';
import { findCommand } from '../keymap/find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const tools = () => useToolStore.getState();

beforeEach(() => {
  resetEditor();
  useSelectionStore.setState({ ...SELECTION_DEFAULTS });
});

describe('S2 the option memory', { tags: ['standard'] }, () => {
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
    const size = optionById('rect.size');
    if (!size) throw new Error('no rectangle size');
    expect(setOption(size, 7)).toBe(true);
    expect(tools().brushSize).toBe(1);
    tools().selectTool('rect');
    expect(tools().brushSize).toBe(7);
  });
});

describe('S2 the option commands', { tags: ['standard'] }, () => {
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

  it('pixel perfect is offered at brush size 1 only', () => {
    expect(optionsOf('sprite', 'pencil').some((spec) => spec.name === 'pixel_perfect')).toBe(true);
    tools().setBrushSize(3);
    expect(optionsOf('sprite', 'pencil').some((spec) => spec.name === 'pixel_perfect')).toBe(false);
  });
});
