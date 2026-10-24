/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { drawSlot } from '../../src/editor/draw-slot';
import { pressPlan } from '../../src/editor/press-plan';
import { runInstant } from '../../src/editor/run-instant';
import { swatchSlot } from '../../src/editor/swatch-slot';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useToolStore } from '../../src/stores/useToolStore';
import { flat, live, resetEditor, tools } from './option-harness';
import { press } from './press-event';

beforeEach(() => useToolStore.setState({ ...TOOL_DEFAULTS }));

describe('the held colours', () => {
  it('start with four different colours', () => {
    const { foreground, background, third, fourth } = tools();
    expect(new Set([foreground, background, third, fourth]).size).toBe(4);
  });

  it('set each of the four slots on its own', () => {
    tools().setColour('foreground', 5);
    tools().setColour('background', 6);
    tools().setColour('third', 7);
    tools().setColour('fourth', 8);
    expect(tools()).toMatchObject({ foreground: 5, background: 6, third: 7, fourth: 8 });
  });

  it('swap colours 1 and 2 with colours 3 and 4', () => {
    tools().setColour('foreground', 5);
    tools().setColour('background', 6);
    tools().setColour('third', 7);
    tools().setColour('fourth', 8);
    tools().swapPairs();
    expect(tools()).toMatchObject({ foreground: 7, background: 8, third: 5, fourth: 6 });
    tools().swapPairs();
    expect(tools()).toMatchObject({ foreground: 5, background: 6, third: 7, fourth: 8 });
  });

  it('keep colours 3 and 4 when colours 1 and 2 swap', () => {
    tools().setColour('foreground', 5);
    tools().setColour('background', 6);
    tools().swapColors();
    expect(tools()).toMatchObject({ foreground: 6, background: 5, third: TOOL_DEFAULTS.third, fourth: TOOL_DEFAULTS.fourth });
  });
});

describe('a click on a swatch', () => {
  it('sets colour 1 on a left click and colour 2 on a right click', () => {
    expect(swatchSlot({ right: false, shift: false })).toBe('foreground');
    expect(swatchSlot({ right: true, shift: false })).toBe('background');
  });

  it('sets colour 3 on Shift and left click and colour 4 on Shift and right click', () => {
    expect(swatchSlot({ right: false, shift: true })).toBe('third');
    expect(swatchSlot({ right: true, shift: true })).toBe('fourth');
  });
});

describe('drawing with the held colours', () => {
  it('draws with colour 1 and colour 2 on the two buttons', () => {
    expect(drawSlot(press(0))).toBe('foreground');
    expect(drawSlot(press(2))).toBe('background');
  });

  it('draws with colour 3 and colour 4 while Control or Command is held', () => {
    expect(drawSlot(press(0, { ctrlKey: true }))).toBe('third');
    expect(drawSlot(press(2, { ctrlKey: true }))).toBe('fourth');
    expect(drawSlot(press(0, { metaKey: true }))).toBe('third');
    expect(drawSlot(press(2, { metaKey: true }))).toBe('fourth');
  });

  it('carries the slot into the press plan of every drawing tool', () => {
    expect(pressPlan('pencil', press(0, { ctrlKey: true }))).toEqual({ kind: 'stroke', tool: 'pencil', slot: 'third', line: false });
    expect(pressPlan('fill', press(2, { ctrlKey: true }))).toEqual({ kind: 'fill', slot: 'fourth' });
    expect(pressPlan('shape', press(0, { ctrlKey: true }))).toEqual({ kind: 'shape', slot: 'third' });
  });

  it('fills with colour 3 and picks into colour 4', () => {
    resetEditor();
    tools().setColour('third', 9);
    runInstant('fill', live(), { x: 0, y: 0 }, 'third');
    expect(flat()[0]).toBe(9);
    runInstant('pick', live(), { x: 0, y: 0 }, 'fourth');
    expect(tools().fourth).toBe(9);
  });
});
