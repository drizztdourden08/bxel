/* @layer core @kind logic */
import {
  assertNameFree,
  checkName,
  defineCommand,
  ERROR_CODE,
  fail,
  registerRef,
  requireBank,
  requireSprite,
  updateProject,
  updateSprite,
} from '@bxel/document';
import { bankSprites } from './bank-sprites';
import { copyBank } from './copy-bank';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteDetachSchema } from './palette-detach-schema';
import { uniqueBankName } from './unique-bank-name';

const paletteDetach = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteDetach,
  scope: 'sprite',
  schema: paletteDetachSchema,
  run: (draft, input) => {
    const spriteId = input.sprites[0];
    if (!spriteId) throw fail(ERROR_CODE.TARGET_EMPTY, 'palette.detach needs one sprite.');
    const sprite = requireSprite(draft.project, spriteId);
    const bank = requireBank(draft.project, sprite.bankId);
    if (bankSprites(draft.project, bank.id).length < 2) {
      throw fail(ERROR_CODE.INCOMPATIBLE_TARGETS, `Sprite "${sprite.name}" already has its own palette.`, {
        details: [{ spriteId, layerId: null, frameId: null, reason: 'the palette is not shared' }],
      });
    }
    const name = input.options.name === undefined ? uniqueBankName(draft.project, bank.name) : checkName(input.options.name);
    assertNameFree(
      draft.project.banks.map((other) => other.name),
      name,
    );
    const copy = copyBank(draft.ids, bank, name);
    updateProject(draft, (project) => ({ ...project, banks: [...project.banks, copy] }));
    updateSprite(draft, spriteId, (current) => ({ ...current, bankId: copy.id }));
    registerRef(draft, input.ref, copy.id);
  },
});

export { paletteDetach };
