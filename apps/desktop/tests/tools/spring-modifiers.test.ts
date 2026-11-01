/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { gesture } from '../../src/editor/gesture-state';
import { useSpringStore } from '../../src/editor/tool-pick/behavior/useSpringStore';
import { springKeyDown } from '../../src/editor/tool-pick/spring-key-down';
import { springKeyHeld } from '../../src/editor/tool-pick/spring-key-held';
import { springKeyTool } from '../../src/editor/tool-pick/spring-key-tool';
import { springKeyUp } from '../../src/editor/tool-pick/spring-key-up';
import { useToolStore } from '../../src/stores/useToolStore';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const press = (key: string, repeat = false) => springKeyDown({ key, repeat });

describe('K1 space and alt spring keys', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useToolStore.setState({ tool: 'pencil' });
    springKeyHeld.key = null;
    gesture.dragging = false;
    useSpringStore.getState().borrow(null, null);
  });

  it('maps space to the hand and alt to the picker', () => {
    expect(springKeyTool(' ', 'pencil')).toBe('hand');
    expect(springKeyTool('Alt', 'pencil')).toBe('picker');
  });

  it('ignores a key that is not a spring key, and the tool already active', () => {
    expect(springKeyTool('x', 'pencil')).toBeNull();
    expect(springKeyTool(' ', 'hand')).toBeNull();
    expect(springKeyTool('Alt', 'picker')).toBeNull();
  });

  it('keeps alt for the tools that already use it as a modifier', () => {
    expect(springKeyTool('Alt', 'select')).toBeNull();
    expect(springKeyTool('Alt', 'zoom')).toBeNull();
  });

  it('borrows the hand while space is held and gives it back on release', () => {
    press(' ');
    expect(useSpringStore.getState().borrowed).toBe('hand');
    expect(useToolStore.getState().tool).toBe('pencil');
    springKeyUp(' ');
    expect(useSpringStore.getState().borrowed).toBeNull();
  });

  it('ignores key repeats and passive modifier keys', () => {
    press(' ', true);
    press('Control');
    expect(useSpringStore.getState().borrowed).toBeNull();
  });

  it('releases the borrow when another key goes down', () => {
    press('Alt');
    expect(useSpringStore.getState().borrowed).toBe('picker');
    press('b');
    expect(useSpringStore.getState().borrowed).toBeNull();
  });

  it('does not release for the key up of a different key', () => {
    press(' ');
    springKeyUp('Alt');
    expect(useSpringStore.getState().borrowed).toBe('hand');
  });

  it('does not borrow in the middle of a stroke', () => {
    gesture.dragging = true;
    press(' ');
    expect(useSpringStore.getState().borrowed).toBeNull();
  });

  it('releases on blur with no key given', () => {
    press(' ');
    springKeyUp();
    expect(useSpringStore.getState().borrowed).toBeNull();
    expect(springKeyHeld.key).toBeNull();
  });
});
