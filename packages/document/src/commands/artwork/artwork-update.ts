/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import type { SpriteId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import { artworkUpdateSchema } from '../../schema/artwork-update-schema';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';

const artworkUpdate = defineCommand({
  name: COMMAND_NAME.artworkUpdate,
  scope: 'none',
  schema: artworkUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const name = options.name === undefined ? draft.artwork.name : checkName(options.name);
    const requested = options.coverSpriteId as SpriteId | null | undefined;
    if (requested) requireSprite(draft.artwork, requested);
    const coverSpriteId = requested === undefined ? draft.artwork.coverSpriteId : requested;
    updateArtwork(draft, (artwork) => ({ ...artwork, name, coverSpriteId }));
  },
});

export { artworkUpdate };
