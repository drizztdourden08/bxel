/* @layer renderer-app @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { notePointer } from '../../src/editor/quick-palette/pointer-point';
import { pickQuick } from '../../src/editor/quick-palette/pick-quick';
import { QUICK_TAP_MS } from '../../src/editor/quick-palette/quick-palette.constants';
import { quickId, parseQuickId } from '../../src/editor/quick-palette/quick-id';
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

const holdContext = (heldMs: number, tap: boolean, cause: 'keyup' | 'blur' = 'keyup') =>
  ({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, heldMs, tap, cause }) as never;

describe('Q2 hold and release of the quick palette key', { tags: ['critical'] }, () => {
  const click = vi.fn();

  beforeEach(() => {
    click.mockClear();
    notePointer({ x: 30, y: 40 });
    vi.stubGlobal('document', { elementFromPoint: () => ({ closest: () => ({ click }) }) });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is a hold command on the same key', () => {
    const def = findCommand(TOOL_COMMAND.quickPalette);
    expect(def.chord).toBe('`');
    expect(def.hold?.tapMs).toBe(QUICK_TAP_MS);
  });

  it('picks the cell under the pointer when the key goes up after a hold', () => {
    findCommand(TOOL_COMMAND.quickPalette).hold?.release(holdContext(400, false));
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('keeps the palette open for clicks after a tap', () => {
    findCommand(TOOL_COMMAND.quickPalette).hold?.release(holdContext(80, true));
    expect(click).not.toHaveBeenCalled();
  });

  it('picks nothing when the window loses focus', () => {
    findCommand(TOOL_COMMAND.quickPalette).hold?.release(holdContext(400, false, 'blur'));
    expect(click).not.toHaveBeenCalled();
  });
});
