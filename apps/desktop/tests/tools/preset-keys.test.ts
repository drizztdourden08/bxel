/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BUILTIN_PRESETS } from '../../src/editor/presets/builtin-presets.constants';
import { COMMAND_GROUP } from '../../src/keymap/keymap.constants';
import { TOOL_COMMAND } from '../../src/keymap/option-command-id.constants';
import { presetKeyCommands } from '../../src/keymap/preset-key-commands';
import { useToolStore } from '../../src/stores/useToolStore';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const MINE = { id: 'user.six', name: 'Six', member: 'pencil', fields: { 'pencil.size': 6 } };

describe('K1 preset keys', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useToolStore.setState({ tool: 'fill' });
  });

  it('give one rebindable command to each preset of the user, none to the built ins', () => {
    const defs = presetKeyCommands([...BUILTIN_PRESETS, MINE]);
    expect(defs.map((def) => def.id)).toEqual([TOOL_COMMAND.presetKey('user.six')]);
    expect(defs[0]?.group).toBe(COMMAND_GROUP.presets);
    expect(defs[0]?.label).toBe('Apply preset Six');
  });

  it('start with no chord, so the keymap page is where a key is chosen', () => {
    expect(presetKeyCommands([MINE])[0]?.chord).toBeUndefined();
  });

  it('apply the preset when run', () => {
    void presetKeyCommands([MINE])[0]?.run({} as never);
    expect(useToolStore.getState()).toMatchObject({ tool: 'pencil', brushSize: 6 });
  });
});
