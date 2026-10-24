/* @layer core @kind logic */
import type { AssetRef } from '../../model/asset.type';
import type { Size } from '../../model/geometry.type';
import type { BankId, CelId, FrameId, LayerId, SpriteId } from '../../model/ids.type';
import { DEFAULT_FRAME_DURATION_MS } from '../../model/limits.constants';
import type { Sprite } from '../../model/sprite.type';
import { emptyCel } from '../../pixels/empty-cel';
import { placeholderBody } from './placeholder-body';
import { placeholderName } from './placeholder-name';
import { PLACEHOLDER_LAYER_NAME, PLACEHOLDER_SPRITE_NAME } from './placeholder.constants';

const placeholderSprite = (link: AssetRef, size: Size, bankId: BankId): Sprite => {
  const body = placeholderBody(link.id);
  const frame = `frm_${body}` as FrameId;
  const cel = `cel_${body}` as CelId;
  return {
    id: link.id as SpriteId,
    name: placeholderName(link.path, PLACEHOLDER_SPRITE_NAME),
    role: 'sprite',
    bankId,
    width: size.width,
    height: size.height,
    pivot: { x2: 0, y2: 0 },
    layers: [{ id: `lay_${body}` as LayerId, name: PLACEHOLDER_LAYER_NAME, visible: true, locked: true, cels: { [frame]: cel } }],
    frames: [{ id: frame, durationMs: DEFAULT_FRAME_DURATION_MS }],
    tags: [],
    slices: [],
    cels: { [cel]: { id: cel, pixels: emptyCel(size) } },
  };
};

export { placeholderSprite };
