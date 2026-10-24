/* @layer renderer-app @kind test */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { SELECTION_COMMAND_ID } from '../../src/keymap/selection-command-id.constants';
import { at, BLOCK, openRig } from './selection-harness';

vi.mock('@drizztdourden08/brock-react', () => ({
  shortcutsHelp: { open: vi.fn() },
  toast: vi.fn(),
  commands: { run: vi.fn() },
  getPlatform: vi.fn(),
  useRecentDocumentsStore: { getState: vi.fn() },
}));

const find = (id: string): CommandDef => {
  const def = APP_COMMANDS.find((each) => each.id === id);
  if (!def) throw new Error(`no command ${id}`);
  return def;
};

const focusIn = (zone: string | null): void => {
  const closest = (selector: string): object | null => (zone !== null && selector.includes(`"${zone}"`) ? {} : null);
  vi.stubGlobal('document', { activeElement: { closest } });
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the Delete chord', () => {
  it('stays off while the Layers list has focus, so only the layer is deleted', () => {
    openRig();
    focusIn('layers');
    expect(find(SELECTION_COMMAND_ID.delete).when?.()).toBe(false);
  });

  it('clears the selected pixels when the canvas has focus', () => {
    const rig = openRig();
    rig.paint(BLOCK, 7);
    rig.select(BLOCK);
    focusIn(null);
    const command = find(SELECTION_COMMAND_ID.delete);
    expect(command.when?.()).toBe(true);
    command.run();
    expect(rig.pixels()[at(5, 5)]).toBe(0);
    expect(rig.target().sprite.layers).toHaveLength(1);
  });

  it('clears pixels when nothing in the page has focus and a selection is live', () => {
    const rig = openRig();
    rig.paint(BLOCK, 7);
    rig.select(BLOCK);
    vi.stubGlobal('document', { activeElement: null });
    expect(find(SELECTION_COMMAND_ID.delete).when?.()).toBe(true);
  });

  it('keeps Escape for the shell escape stack, not for a command chord', () => {
    expect(find(SELECTION_COMMAND_ID.cancel).chord).toBeUndefined();
    expect(find(SELECTION_COMMAND_ID.apply).chord).toBe('Enter');
  });
});
