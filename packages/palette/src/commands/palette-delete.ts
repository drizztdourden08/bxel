/* @layer core @kind logic */
import { defineCommand, ERROR_CODE, fail, requireBank, updateProject } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { bankSprites } from './bank-sprites';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteDeleteSchema } from './palette-delete-schema';

const paletteDelete = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteDelete,
  scope: 'none',
  schema: paletteDeleteSchema,
  run: (draft, input) => {
    const bank = requireBank(draft.project, input.options.bankId as BankId);
    if (bank.id === draft.project.defaultBankId) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'The default palette cannot be deleted.', { path: 'options.bankId' });
    }
    const users = bankSprites(draft.project, bank.id);
    if (users.length > 0) {
      throw fail(ERROR_CODE.INCOMPATIBLE_TARGETS, `${users.length} sprites still use palette "${bank.name}".`, {
        path: 'options.bankId',
        details: users.map((sprite) => ({ spriteId: sprite.id, layerId: null, frameId: null, reason: 'uses this palette' })),
      });
    }
    if (draft.project.tilesets.some((tileset) => tileset.bankId === bank.id)) {
      throw fail(ERROR_CODE.INCOMPATIBLE_TARGETS, `A tileset still uses palette "${bank.name}".`, { path: 'options.bankId' });
    }
    updateProject(draft, (project) => ({ ...project, banks: project.banks.filter((other) => other.id !== bank.id) }));
  },
});

export { paletteDelete };
