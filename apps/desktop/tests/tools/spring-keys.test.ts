/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { parsePrefs } from '../../src/editor/tool-options/parse-prefs';
import { beginSpring } from '../../src/editor/tool-pick/begin-spring';
import { endSpring } from '../../src/editor/tool-pick/end-spring';
import { isSpringTool } from '../../src/editor/tool-pick/is-spring-tool';
import { useSpringStore } from '../../src/editor/tool-pick/behavior/useSpringStore';
import { toolIds } from '../../src/editor/tool-catalogue/tool-ids';
import { useToolPrefsStore } from '../../src/stores/useToolPrefsStore';
import { useToolStore } from '../../src/stores/useToolStore';

const release = (heldMs: number, cause: 'keyup' | 'blur' | 'run' | 'dispose' = 'keyup') =>
  endSpring({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, heldMs, tap: false, cause });

describe('K1 spring loaded tool keys', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useToolStore.setState({ tool: 'pencil' });
    useSpringStore.getState().borrow(null, null);
    useToolPrefsStore.getState().patch({ springMs: 220 });
  });

  it('applies to every tool of the catalogue', () => {
    expect(toolIds().every(isSpringTool)).toBe(true);
  });

  it('goes back to the tool before when a key stays held past the delay', () => {
    beginSpring('rect');
    useToolStore.setState({ tool: 'rect' });
    expect(useSpringStore.getState().borrowed).toBe('rect');
    release(400);
    expect(useToolStore.getState().tool).toBe('pencil');
    expect(useSpringStore.getState().borrowed).toBeNull();
  });

  it('keeps the new tool after a quick press', () => {
    beginSpring('rect');
    useToolStore.setState({ tool: 'rect' });
    release(80);
    expect(useToolStore.getState().tool).toBe('rect');
    expect(useSpringStore.getState().borrowed).toBeNull();
  });

  it('reads the delay from the setting', () => {
    useToolPrefsStore.getState().patch({ springMs: 500 });
    beginSpring('rect');
    useToolStore.setState({ tool: 'rect' });
    release(400);
    expect(useToolStore.getState().tool).toBe('rect');
  });

  it('keeps the delay between 120 and 600 ms when it is read back', () => {
    expect(parsePrefs({ springMs: 5 }).springMs).toBe(120);
    expect(parsePrefs({ springMs: 5000 }).springMs).toBe(600);
    expect(parsePrefs({}).springMs).toBe(220);
  });
});
