/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import type { BankId, SpriteId } from '../../model/ids.type';
import { requireBank } from '../../read/require-bank';
import { requireSprite } from '../../read/require-sprite';
import { artworkUpdateSchema } from '../../schema/artwork-update-schema';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { nextStrict } from './next-strict';

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
    const wantedBank = options.defaultBankId as BankId | undefined;
    if (wantedBank !== undefined) requireBank(draft.artwork, wantedBank);
    const defaultBankId = wantedBank ?? draft.artwork.defaultBankId;
    const platformId = options.platformId === undefined ? draft.artwork.platformId : (options.platformId ?? undefined);
    const platformStrict = nextStrict(platformId, options.platformStrict ?? draft.artwork.platformStrict);
    updateArtwork(draft, (artwork) => ({ ...artwork, name, coverSpriteId, defaultBankId, platformId, platformStrict }));
  },
});

export { artworkUpdate };
