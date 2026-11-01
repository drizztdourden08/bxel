/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import { TOOL_COMMAND } from '../../src/keymap/option-command-id.constants';
import { TOOL_COMMANDS } from '../../src/keymap/tool-commands.constants';
import { useCustomizeStore } from '../../src/stores/useCustomizeStore';
import { useToolPrefsStore } from '../../src/stores/useToolPrefsStore';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

describe('K1 customizing the tools', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useCustomizeStore.getState().show(false);
    useToolPrefsStore.getState().resetLayout();
  });

  it('opens the sheet from its command', () => {
    const command = TOOL_COMMANDS.find((each) => each.id === TOOL_COMMAND.customize);
    expect(command).toBeDefined();
    void command?.run({} as never);
    expect(useCustomizeStore.getState().open).toBe(true);
  });

  it('takes a tool off the rail and puts every tool back', () => {
    const member = slotsOf('sprite').flatMap((slot) => slot.members)[0];
    if (!member) throw new Error('no member');
    useToolPrefsStore.getState().toggleHidden(member.id);
    expect(useToolPrefsStore.getState().hiddenMembers).toEqual([member.id]);
    useToolPrefsStore.getState().resetLayout();
    expect(useToolPrefsStore.getState().hiddenMembers).toEqual([]);
  });
});
