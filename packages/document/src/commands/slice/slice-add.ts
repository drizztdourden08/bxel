/* @layer core @kind logic */
import { updateSprite } from '../../draft/update-sprite';
import type { SliceId } from '../../model/ids.type';
import type { Slice } from '../../model/sprite.type';
import { requireSprite } from '../../read/require-sprite';
import { sliceAddSchema } from '../../schema/slice-add-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { registerCreatedRef } from '../register-created-ref';
import { checkSlice } from './check-slice';

const sliceAdd = defineCommand({
  name: COMMAND_NAME.sliceAdd,
  scope: 'sprites',
  schema: sliceAddSchema,
  run: (draft, input) => {
    const { options } = input;
    const name = checkName(options.name);
    const created: SliceId[] = [];
    for (const spriteId of input.sprites) {
      const sprite = requireSprite(draft.artwork, spriteId);
      const shape = { rect: options.rect, pivot: options.pivot ?? null, center: options.center ?? null };
      checkSlice(shape, sprite);
      assertNameFree(
        sprite.slices.map((slice) => slice.name),
        name,
      );
      const slice: Slice = { id: draft.ids.next('slc') as SliceId, name, ...shape };
      updateSprite(draft, spriteId, (current) => ({ ...current, slices: [...current.slices, slice] }));
      created.push(slice.id);
    }
    registerCreatedRef(draft, input, created, 'slice');
  },
});

export { sliceAdd };
