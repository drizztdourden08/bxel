/* @layer core @kind logic */
import {
  defineCommand,
  ERROR_CODE,
  fail,
  registerRef,
  requireBank,
  requireSprite,
  updateArtwork,
  updateSprite,
} from '@bxel/document';
import { bankCopyName } from './bank-copy-name';
import { bankSprites } from './bank-sprites';
import { copyBank } from './copy-bank';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteDetachSchema } from './palette-detach-schema';

const paletteDetach = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteDetach,
  scope: 'sprite',
  schema: paletteDetachSchema,
  run: (draft, input) => {
    const spriteId = input.sprites[0];
    if (!spriteId) throw fail(ERROR_CODE.TARGET_EMPTY, 'palette.detach needs one sprite.');
    const sprite = requireSprite(draft.artwork, spriteId);
    const bank = requireBank(draft.artwork, sprite.bankId);
    if (bankSprites(draft.artwork, bank.id).length < 2) {
      throw fail(ERROR_CODE.INCOMPATIBLE_TARGETS, `Sprite "${sprite.name}" already has its own palette.`, {
        details: [{ spriteId, layerId: null, frameId: null, reason: 'the palette is not shared' }],
      });
    }
    const copy = copyBank(draft.ids, bank, bankCopyName(draft, bank, input.options.name));
    updateArtwork(draft, (artwork) => ({ ...artwork, banks: [...artwork.banks, copy] }));
    updateSprite(draft, spriteId, (current) => ({ ...current, bankId: copy.id }));
    registerRef(draft, input.ref, copy.id);
  },
});

export { paletteDetach };
