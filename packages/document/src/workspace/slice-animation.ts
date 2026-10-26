/* @layer core @kind logic */
import { ASSET_KIND } from '../model/asset-format.constants';
import type { AssetSlice } from '../model/asset.type';
import type { AnimationId, SpriteId } from '../model/ids.type';
import { findSprite } from '../read/find-sprite';
import { requireAnimation } from '../read/require-animation';
import { requireBank } from '../read/require-bank';
import { homedPresets } from './homed-presets';
import { linkTo } from './link-to';
import type { SliceContext } from './slice-context.type';

const sliceAnimation = (context: SliceContext, id: string): AssetSlice => {
  const { artwork } = context;
  const animation = requireAnimation(artwork, id as AnimationId);
  const bank = requireBank(artwork, animation.bankId);
  const used = [...new Set(animation.frames.flatMap((frame) => (frame.spriteId === null ? [] : [frame.spriteId])))];
  const sprites = used.flatMap((spriteId: SpriteId) => findSprite(artwork, spriteId) ?? []);
  const owned = sprites.filter((sprite) => sprite.role === 'frame');
  const shared = sprites.filter((sprite) => sprite.role !== 'frame').map((sprite) => sprite.id);
  return {
    kind: ASSET_KIND.animation,
    id,
    name: animation.name,
    artwork: { banks: [bank], sprites: owned, animations: [animation], presets: homedPresets(context, { kind: ASSET_KIND.animation, id }) },
    links: linkTo(context, [bank.id, ...shared]),
  };
};

export { sliceAnimation };
