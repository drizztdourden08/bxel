/* @layer renderer-app @kind test */
import type { HoldContext } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { notePointer } from '../../src/editor/quick-palette/note-pointer';
import { pickQuick } from '../../src/editor/quick-palette/pick-quick';
import { quickId } from '../../src/editor/quick-palette/make-quick-id';
import { parseQuickId } from '../../src/editor/quick-palette/quick-id';
import { quickSections } from '../../src/editor/quick-palette/quick-sections';
import { TOOL_COMMAND } from '../../src/keymap/option-command-id.constants';
import { useQuickPaletteStore } from '../../src/stores/useQuickPaletteStore';
import { useToolPresetStore } from '../../src/stores/useToolPresetStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { resetEditor } from '../editor/option-harness';
import { findCommand } from '../keymap/find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const INPUT = { surface: 'sprite', recent: ['eraser'], presets: [], keysOf: () => undefined } as const;

beforeEach(() => {
  resetEditor();
  useToolPresetStore.setState({ user: [], draft: null });
  useQuickPaletteStore.getState().close();
});

describe('Q1 the quick palette', { tags: ['critical'] }, () => {
  it('opens at the pointer from its command', () => {
    notePointer({ x: 40, y: 72 });
    void findCommand(TOOL_COMMAND.quickPalette).run({} as never);
    expect(useQuickPaletteStore.getState().open).toBe(true);
    expect(useQuickPaletteStore.getState().at).toEqual({ x: 40, y: 72 });
  });

  it('has a default key', () => {
    expect(findCommand(TOOL_COMMAND.quickPalette).chord).toBe('`');
  });

  it('picks a tool from a cell', () => {
    pickQuick(quickId('tool', 'eraser'));
    expect(useToolStore.getState().tool).toBe('eraser');
  });

  it('picks a tool from the recent section', () => {
    pickQuick(quickId('recent', 'fill'));
    expect(useToolStore.getState().tool).toBe('fill');
  });

  it('applies a preset from a cell', () => {
    pickQuick(quickId('preset', 'builtin.eraser-1'));
    expect(useToolStore.getState().tool).toBe('eraser');
  });

  it('closes when the palette asks to close, as Escape and a press outside do', () => {
    notePointer({ x: 1, y: 2 });
    void findCommand(TOOL_COMMAND.quickPalette).run({} as never);
    useQuickPaletteStore.getState().close();
    expect(useQuickPaletteStore.getState().open).toBe(false);
  });

  it('lists the rail groups, then Recent, with ids that read back', () => {
    const sections = quickSections(INPUT);
    expect(sections.at(-1)?.id).toBe('recent');
    expect(sections.length).toBeGreaterThan(1);
    const [first] = sections[0]?.items ?? [];
    expect(parseQuickId(first?.id ?? '')?.kind).toBe('tool');
  });
});

const press = () => {
  notePointer({ x: 40, y: 72 });
  void findCommand(TOOL_COMMAND.quickPalette).run({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined });
};

const release = (cause: HoldContext['cause'], heldMs: number) =>
  findCommand(TOOL_COMMAND.quickPalette).hold?.release({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, heldMs, tap: heldMs < 120, cause });

describe('Q2 the quick palette hold and release', { tags: ['critical'] }, () => {
  it('declares a hold on its command', () => {
    expect(findCommand(TOOL_COMMAND.quickPalette).hold).toBeDefined();
  });

  it('opens holding when the key goes down', () => {
    press();
    expect(useQuickPaletteStore.getState()).toMatchObject({ open: true, holding: true });
  });

  it('does not hold when run from a menu or the assistant', () => {
    void findCommand(TOOL_COMMAND.quickPalette).run({ point: { x: 0, y: 0 }, target: null, trigger: 'assistant', data: undefined });
    expect(useQuickPaletteStore.getState()).toMatchObject({ open: true, holding: false });
  });

  it('clears holding on the key release so the palette picks', () => {
    press();
    release('keyup', 400);
    expect(useQuickPaletteStore.getState()).toMatchObject({ open: true, holding: false });
  });

  it('keeps the palette open after a tap', () => {
    press();
    release('keyup', 60);
    expect(useQuickPaletteStore.getState()).toMatchObject({ open: true, holding: false });
  });

  it('closes without picking when the window loses focus', () => {
    press();
    release('blur', 400);
    expect(useQuickPaletteStore.getState()).toMatchObject({ open: false, holding: false });
  });
});
