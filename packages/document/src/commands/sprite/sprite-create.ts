/* @layer core @kind logic */
import { addSprite } from '../../draft/add-sprite';
import { registerRef } from '../../draft/register-ref';
import type { BankId } from '../../model/ids.type';
import { requireBank } from '../../read/require-bank';
import { spriteCreateSchema } from '../../schema/sprite-create-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { checkPivot } from '../../validate/check-pivot';
import { checkSize } from '../../validate/check-size';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { buildSprite } from './build-sprite';

const spriteCreate = defineCommand({
  name: COMMAND_NAME.spriteCreate,
  scope: 'none',
  schema: spriteCreateSchema,
  run: (draft, input) => {
    const { options } = input;
    const name = checkName(options.name);
    checkSize(options);
    assertNameFree(
      draft.artwork.sprites.map((sprite) => sprite.name),
      name,
    );
    const bankId = (options.bankId ?? draft.artwork.defaultBankId) as BankId;
    requireBank(draft.artwork, bankId);
    if (options.pivot) checkPivot(options.pivot, options);
    const sprite = buildSprite({ ids: draft.ids, name, width: options.width, height: options.height, bankId, pivot: options.pivot ?? null, created: draft.stamp });
    addSprite(draft, options.pixelGrid ? { ...sprite, pixelGrid: options.pixelGrid } : sprite);
    registerRef(draft, input.ref, sprite.id);
  },
});

export { spriteCreate };
