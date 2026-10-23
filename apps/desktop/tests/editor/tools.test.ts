/* @layer renderer-app @kind test */
import type { Brush } from '@bxel/raster';
import { beforeEach, describe, expect, it } from 'vitest';
import { beginStroke } from '../../src/editor/begin-stroke';
import { keyAction } from '../../src/editor/key-action';
import type { KeyLike } from '../../src/editor/editor.type';
import { paletteSlots } from '../../src/editor/palette-slots';
import { PALETTE_TEXT } from '../../src/editor/palette-text.constants';
import { pressPlan } from '../../src/editor/press-plan';
import { runAction } from '../../src/editor/run-action';
import { runInstant } from '../../src/editor/run-instant';
import { samplePixel } from '../../src/editor/sample-pixel';
import { strokeRequest } from '../../src/editor/stroke-request';
import { swatchRole } from '../../src/editor/swatch-role';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useToolStore } from '../../src/stores/useToolStore';
import { openEditor } from './editor-harness';

const brush: Brush = { shape: 'square', size: 1 };
const key = (name: string, modifiers: Partial<KeyLike> = {}): KeyLike => ({
  key: name,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  altKey: false,
  ...modifiers,
});

beforeEach(() => useToolStore.setState({ ...TOOL_DEFAULTS }));

describe('the picker', () => {
  it('reads the visible index under the pointer and ignores pixels outside', () => {
    const { host, target } = openEditor();
    const session = beginStroke({ target: target(), tool: 'pencil', index: 9, brush, at: { x: 5, y: 4 } });
    host.execute(strokeRequest(target(), session));
    expect(samplePixel(target(), { x: 5, y: 4 })).toBe(9);
    expect(samplePixel(target(), { x: 0, y: 0 })).toBe(0);
    expect(samplePixel(target(), { x: -1, y: 0 })).toBeNull();
    expect(samplePixel(target(), { x: 32, y: 3 })).toBeNull();
  });

  it('sets the front colour on a left press and the back colour on a right press', () => {
    const { host, target } = openEditor();
    host.execute(strokeRequest(target(), beginStroke({ target: target(), tool: 'pencil', index: 9, brush, at: { x: 5, y: 4 } })));
    runInstant('pick', target(), { x: 5, y: 4 }, 'foreground');
    expect(useToolStore.getState().foreground).toBe(9);
    runInstant('pick', target(), { x: 0, y: 0 }, 'background');
    expect(useToolStore.getState().background).toBe(0);
    runInstant('pick', target(), { x: -3, y: 0 }, 'foreground');
    expect(useToolStore.getState().foreground).toBe(9);
  });
});

describe('press plans', () => {
  it('maps tool, button and Alt to an action', () => {
    expect(pressPlan('pencil', { button: 0, altKey: false })).toEqual({ kind: 'stroke', tool: 'pencil', slot: 'foreground' });
    expect(pressPlan('pencil', { button: 2, altKey: false })).toEqual({ kind: 'stroke', tool: 'pencil', slot: 'background' });
    expect(pressPlan('eraser', { button: 0, altKey: false })).toEqual({ kind: 'stroke', tool: 'eraser', slot: 'foreground' });
    expect(pressPlan('fill', { button: 0, altKey: false })).toEqual({ kind: 'fill', slot: 'foreground' });
    expect(pressPlan('picker', { button: 2, altKey: false })).toEqual({ kind: 'pick', slot: 'background' });
    expect(pressPlan('fill', { button: 0, altKey: true })).toEqual({ kind: 'pick', slot: 'foreground' });
    expect(pressPlan('pencil', { button: 1, altKey: false })).toBeNull();
  });
});

describe('the palette', () => {
  it('lists the slots with index labels and the count line', () => {
    const { target } = openEditor();
    const { bank } = target();
    const slots = paletteSlots(bank);
    expect(slots).toHaveLength(16);
    expect(slots[0]).toMatchObject({ index: 0, transparent: true, label: 'Swatch 0, transparent' });
    expect(slots[5]).toMatchObject({ index: 5, hex: '#E0245E', label: 'Swatch 5, crimson, #E0245E' });
    expect(PALETTE_TEXT.count(bank.cap, bank.transparent)).toBe('15 opaque + transparent = 16');
  });

  it('marks the front and back swatches', () => {
    expect(swatchRole(3, 3, 0)).toBe('foreground');
    expect(swatchRole(0, 3, 0)).toBe('background');
    expect(swatchRole(8, 3, 0)).toBeNull();
  });

  it('sets the front and back colours and swaps them', () => {
    const tools = useToolStore.getState();
    tools.setForeground(6);
    tools.setBackground(2);
    runAction({ kind: 'swap' });
    expect(useToolStore.getState()).toMatchObject({ foreground: 2, background: 6 });
  });
});

describe('editor keys', () => {
  it('selects tools with B E G I and swaps with X', () => {
    expect(keyAction(key('b'))).toEqual({ kind: 'tool', tool: 'pencil' });
    expect(keyAction(key('E'))).toEqual({ kind: 'tool', tool: 'eraser' });
    expect(keyAction(key('g'))).toEqual({ kind: 'tool', tool: 'fill' });
    expect(keyAction(key('i'))).toEqual({ kind: 'tool', tool: 'picker' });
    expect(keyAction(key('x'))).toEqual({ kind: 'swap' });
    expect(keyAction(key('q'))).toBeNull();
    runAction({ kind: 'tool', tool: 'fill' });
    expect(useToolStore.getState().tool).toBe('fill');
  });

  it('maps Ctrl+Z, Ctrl+Y and Ctrl+Shift+Z to undo and redo', () => {
    expect(keyAction(key('z', { ctrlKey: true }))).toEqual({ kind: 'undo' });
    expect(keyAction(key('z', { metaKey: true }))).toEqual({ kind: 'undo' });
    expect(keyAction(key('y', { ctrlKey: true }))).toEqual({ kind: 'redo' });
    expect(keyAction(key('Z', { ctrlKey: true, shiftKey: true }))).toEqual({ kind: 'redo' });
    expect(keyAction(key('b', { ctrlKey: true }))).toBeNull();
    expect(keyAction(key('b', { altKey: true }))).toBeNull();
  });
});
