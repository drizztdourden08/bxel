/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { optionById } from '../../src/editor/tool-options/option-by-id';
import { OPTION_SPECS } from '../../src/editor/tool-options/option-specs.constants';
import { optionCommandOf } from '../../src/keymap/option-command-of';
import { OPTION_COMMAND } from '../../src/keymap/option-command-id.constants';
import { SELECTION_COMMAND_ID } from '../../src/keymap/selection-command-id.constants';
import { findCommand } from '../keymap/find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

const commandOf = (id: string): string | undefined => {
  const spec = optionById(id);
  return spec ? optionCommandOf(spec) : undefined;
};

describe('K1 the command behind an option', { tags: ['critical'] }, () => {
  it('is the shared command of a toggle or a choice and the first shortcut of an action', () => {
    expect(commandOf('pencil.pixel_perfect')).toBe(OPTION_COMMAND.pixelPerfect);
    expect(commandOf('shade.pixel_perfect')).toBe(OPTION_COMMAND.pixelPerfect);
    expect(commandOf('select.shape')).toBe(OPTION_COMMAND.selectShape);
    expect(commandOf('select.invert')).toBe(SELECTION_COMMAND_ID.invert);
    expect(commandOf('select.deselect')).toBe(SELECTION_COMMAND_ID.clear);
  });

  it('names a command the keymap knows for every option on the paint surface', () => {
    const ids = OPTION_SPECS.filter((spec) => spec.surface === 'paint').flatMap((spec) => optionCommandOf(spec) ?? []);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(findCommand(id).id).toBe(id);
  });
});
