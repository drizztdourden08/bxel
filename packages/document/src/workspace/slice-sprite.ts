/* @layer core @kind logic */
import { ASSET_KIND } from '../model/asset-format.constants';
import type { AssetSlice } from '../model/asset.type';
import type { SpriteId } from '../model/ids.type';
import { requireBank } from '../read/require-bank';
import { requireSprite } from '../read/require-sprite';
import { homedPresets } from './homed-presets';
import { linkTo } from './link-to';
import type { SliceContext } from './slice-context.type';

const sliceSprite = (context: SliceContext, id: string): AssetSlice => {
  const sprite = requireSprite(context.artwork, id as SpriteId);
  const bank = requireBank(context.artwork, sprite.bankId);
  return {
    kind: ASSET_KIND.sprite,
    id,
    name: sprite.name,
    artwork: { banks: [bank], sprites: [sprite], presets: homedPresets(context, { kind: ASSET_KIND.sprite, id }) },
    links: linkTo(context, [bank.id]),
  };
};

export { sliceSprite };
