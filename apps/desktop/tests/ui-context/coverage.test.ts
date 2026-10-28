/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { COMMAND_RULES } from '../../src/ui-context/rules/command.rules.constants';
import { hasRule } from '../../src/ui-context/has-rule';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

const REGISTERED_ELSEWHERE = ['palette.edit_swatch'];

describe('the rule table', () => {
  it('holds a rule for every command of the app, so none is shown by silence', () => {
    const missing = APP_COMMANDS.map((def) => def.id).filter((id) => !hasRule(id));
    expect(missing).toEqual([]);
  });

  it('holds no rule for a command that does not exist', () => {
    const ids = new Set(APP_COMMANDS.map((def) => def.id));
    const stray = Object.keys(COMMAND_RULES).filter((id) => !ids.has(id) && !REGISTERED_ELSEWHERE.includes(id));
    expect(stray).toEqual([]);
  });
});
