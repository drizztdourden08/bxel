/* @layer core @kind logic */
import { addSheetEntry } from '../../draft/add-sheet-entry';
import { cloneSprite } from '../../draft/clone-sprite';
import { insertSprite } from '../../draft/insert-sprite';
import type { SpriteId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import { spriteDuplicateSchema } from '../../schema/sprite-duplicate-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { freeName } from '../layer/free-name';
import { COPY_SUFFIX } from '../layer/layer.constants';
import { registerCreatedRef } from '../register-created-ref';

const spriteDuplicate = defineCommand({
  name: COMMAND_NAME.spriteDuplicate,
  scope: 'sprites',
  schema: spriteDuplicateSchema,
  run: (draft, input) => {
    const { name } = input.options;
    if (name !== undefined && input.sprites.length > 1) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'A name fits one sprite. Leave it out to number the copies.', { path: 'options.name' });
    }
    const created: SpriteId[] = [];
    for (const id of input.sprites) {
      const source = requireSprite(draft.artwork, id);
      if (source.role === 'tile') throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${source.name}" is a tile and cannot be duplicated.`);
      const taken = draft.artwork.sprites.map((sprite) => sprite.name);
      const label = name === undefined ? freeName(taken, `${source.name}${COPY_SUFFIX}`) : checkName(name);
      if (name !== undefined) assertNameFree(taken, label);
      const copy = cloneSprite(draft.ids, source, label);
      insertSprite(draft, copy, id);
      for (const sheet of draft.artwork.sheets.filter((item) => item.entries.some((entry) => entry.spriteId === id))) {
        addSheetEntry(draft, sheet.id, copy.id);
      }
      created.push(copy.id);
    }
    registerCreatedRef(draft, input, created, 'sprite');
  },
});

export { spriteDuplicate };
