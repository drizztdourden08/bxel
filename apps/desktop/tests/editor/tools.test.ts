/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { beginStroke } from '../../src/editor/begin-stroke';
import { paletteSlots } from '../../src/editor/palette-slots';
import { PALETTE_TEXT } from '../../src/editor/palette-text.constants';
import { pressPlan } from '../../src/editor/press-plan';
import { runInstant } from '../../src/editor/run-instant';
import { samplePixel } from '../../src/editor/sample-pixel';
import { stepColour } from '../../src/editor/step-colour';
import { strokeRequest } from '../../src/editor/stroke-request';
import { swatchMarks } from '../../src/editor/swatch-marks';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { openEditor, plainOptions } from './editor-harness';
import { press } from './press-event';


beforeEach(() => useToolStore.setState({ ...TOOL_DEFAULTS }));

describe('the picker', () => {
  it('reads the visible index under the pointer and ignores pixels outside', () => {
    const { host, target } = openEditor();
    const session = beginStroke({ target: target(), tool: 'pencil', index: 9, options: plainOptions, at: { x: 5, y: 4 } });
    host.execute(strokeRequest(target(), session));
    expect(samplePixel(target(), { x: 5, y: 4 })).toBe(9);
    expect(samplePixel(target(), { x: 0, y: 0 })).toBe(0);
    expect(samplePixel(target(), { x: -1, y: 0 })).toBeNull();
    expect(samplePixel(target(), { x: 32, y: 3 })).toBeNull();
  });

  it('sets the front colour on a left press and the back colour on a right press', () => {
    const { host, target } = openEditor();
    const session = beginStroke({ target: target(), tool: 'pencil', index: 9, options: plainOptions, at: { x: 5, y: 4 } });
    host.execute(strokeRequest(target(), session));
    runInstant('pick', target(), { x: 5, y: 4 }, 'foreground');
    expect(useToolStore.getState().foreground).toBe(9);
    runInstant('pick', target(), { x: 0, y: 0 }, 'background');
    expect(useToolStore.getState().background).toBe(0);
    runInstant('pick', target(), { x: -3, y: 0 }, 'foreground');
    expect(useToolStore.getState().foreground).toBe(9);
  });
});

describe('press plans', () => {
  it('maps tool, button, Shift and Alt to an action', () => {
    expect(pressPlan('pencil', press(0))).toEqual({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false });
    expect(pressPlan('pencil', press(2))).toEqual({ kind: 'stroke', tool: 'pencil', slot: 'background', line: false });
    expect(pressPlan('pencil', press(0, { shiftKey: true }))).toEqual({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: true });
    expect(pressPlan('eraser', press(0))).toEqual({ kind: 'stroke', tool: 'eraser', slot: 'foreground', line: false });
    expect(pressPlan('fill', press(0))).toEqual({ kind: 'fill', slot: 'foreground' });
    expect(pressPlan('shape', press(2))).toEqual({ kind: 'shape', slot: 'background' });
    expect(pressPlan('picker', press(2))).toEqual({ kind: 'pick', slot: 'background' });
    expect(pressPlan('zoom', press(0))).toEqual({ kind: 'zoom', out: false });
    expect(pressPlan('zoom', press(2))).toEqual({ kind: 'zoom', out: true });
    expect(pressPlan('hand', press(0))).toBeNull();
    expect(pressPlan('pencil', press(1))).toBeNull();
  });

  it('picks with any tool while Alt is held, even the shape and zoom tools', () => {
    expect(pressPlan('fill', press(0, { altKey: true }))).toEqual({ kind: 'pick', slot: 'foreground' });
    expect(pressPlan('shape', press(0, { altKey: true }))).toEqual({ kind: 'pick', slot: 'foreground' });
    expect(pressPlan('zoom', press(2, { altKey: true }))).toEqual({ kind: 'pick', slot: 'background' });
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

  it('marks a swatch with the number of every held colour that uses it', () => {
    const held = { foreground: 3, background: 0, third: 3, fourth: 7 };
    expect(swatchMarks(3, held)).toEqual([1, 3]);
    expect(swatchMarks(0, held)).toEqual([2]);
    expect(swatchMarks(7, held)).toEqual([4]);
    expect(swatchMarks(8, held)).toEqual([]);
  });

  it('sets the front and back colours and swaps them', () => {
    const tools = useToolStore.getState();
    tools.setForeground(6);
    tools.setBackground(2);
    useToolStore.getState().swapColors();
    expect(useToolStore.getState()).toMatchObject({ foreground: 2, background: 6 });
  });

  it('steps the front colour back and forward and wraps at both ends', () => {
    createDefaultArtwork(useDocumentStore.getState().host);
    useToolStore.getState().setForeground(0);
    stepColour(-1);
    expect(useToolStore.getState().foreground).toBe(15);
    stepColour(1);
    expect(useToolStore.getState().foreground).toBe(0);
    stepColour(1);
    expect(useToolStore.getState().foreground).toBe(1);
  });
});
