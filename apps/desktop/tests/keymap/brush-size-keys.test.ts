/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { OPTION_COMMAND } from '../../src/keymap/option-command-id.constants';
import { findCommand } from './find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./brock-react-mock')).brockReactMock());

describe('W7 the bracket keys of the brush', { tags: ['standard'] }, () => {
  it('change the size by four on Shift and the tip on Alt', () => {
    expect(findCommand(OPTION_COMMAND.sizeDownBy).chord).toBe('Shift+[');
    expect(findCommand(OPTION_COMMAND.sizeUpBy).chord).toBe('Shift+]');
    expect(findCommand(OPTION_COMMAND.tipPrevious).chord).toBe('Alt+[');
    expect(findCommand(OPTION_COMMAND.tipNext).chord).toBe('Alt+]');
  });
});
