/* @layer core @kind logic */
import { ERROR_CODE, fail, requireSprite } from '@bxel/document';
import type { Artwork, FrameId, LayerId, SpriteId } from '@bxel/document';
import type { SourceRegion, SourceRequest } from './source-region.type';

const sourceRegion = (artwork: Artwork, request: SourceRequest): SourceRegion => {
  const sprite = requireSprite(artwork, request.sprite as SpriteId);
  const layer = sprite.layers.find((each) => each.id === (request.layer as LayerId));
  if (!layer) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `The source layer ${request.layer} is not in the source sprite.`, { path: 'options.from.layer' });
  const celId = layer.cels[request.frame as FrameId];
  const pixels = celId ? sprite.cels[celId]?.pixels : undefined;
  if (request.mask && (request.mask.width !== sprite.width || request.mask.height !== sprite.height)) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'The source mask must be as large as the source sprite.', { path: 'options.from.mask' });
  }
  return { sprite, pixels: pixels ?? new Uint8Array(sprite.width * sprite.height), mask: request.mask, rect: request.rect };
};

export { sourceRegion };
