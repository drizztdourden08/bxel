/* @layer core @kind logic */
import { defineCommand, requireSprite } from '@bxel/document';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyToCels } from './apply-to-cels';
import { landCopy } from './land-copy';
import { paletteLookup } from './palette-lookup';
import { pixelsCopyRegionSchema } from './schema/pixels-copy-region-schema';
import { sourceRegion } from './source-region';
import { uniqueCels } from './unique-cels';

const pixelsCopyRegion = defineCommand({
  name: ADVANCED_COMMAND.pixelsCopyRegion,
  scope: 'cels',
  schema: pixelsCopyRegionSchema,
  run: (draft, input) => {
    const { from, at, remap } = input.options;
    const source = sourceRegion(draft.artwork, from);
    const [spriteId] = input.sprites;
    const target = spriteId ? requireSprite(draft.artwork, spriteId) : source.sprite;
    const differs = target.bankId !== source.sprite.bankId;
    const bank = (id: string) => draft.artwork.banks.find((each) => each.id === id);
    const [fromBank, toBank] = [bank(source.sprite.bankId), bank(target.bankId)];
    const lookup = remap && differs && fromBank && toBank ? paletteLookup(fromBank, toBank) : null;
    applyToCels(draft, uniqueCels(input.cels), (view) => landCopy(view, source, at, lookup));
  },
});

export { pixelsCopyRegion };
