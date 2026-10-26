/* @layer core @kind logic */
import type { AssetRef } from '../../model/asset.type';
import type { Animation, AnimSpanTag } from '../../model/animation.type';
import { DEFAULT_ANIM_LOOP, DEFAULT_DIRECTION_PATTERN } from '../../model/animation.constants';
import type { AnimationId, AnimFrameId, BankId, TagId } from '../../model/ids.type';
import { DEFAULT_FRAME_DURATION_MS } from '../../model/limits.constants';
import type { Size } from '../../model/geometry.type';
import { placeholderBody } from './placeholder-body';
import { placeholderName } from './placeholder-name';
import { PLACEHOLDER_ANIMATION_NAME } from './placeholder.constants';

const placeholderAnimation = (link: AssetRef, size: Size, bankId: BankId, tagIds: readonly TagId[]): Animation => {
  const frame = `afr_${placeholderBody(link.id)}` as AnimFrameId;
  const tags = tagIds.map(
    (id, index): AnimSpanTag => ({ kind: 'span', id, name: `Missing tag ${index + 1}`, from: frame, to: frame, direction: 'forward', repeat: 0 }),
  );
  return {
    id: link.id as AnimationId,
    name: placeholderName(link.path, PLACEHOLDER_ANIMATION_NAME),
    bankId,
    width: size.width,
    height: size.height,
    anchor: { x2: size.width, y2: size.height },
    loop: DEFAULT_ANIM_LOOP,
    directions: 'none',
    directionPattern: DEFAULT_DIRECTION_PATTERN,
    frames: [{ id: frame, spriteId: null, clip: null, durationMs: DEFAULT_FRAME_DURATION_MS, offset: { x: 0, y: 0 }, pivot: null }],
    tags,
  };
};

export { placeholderAnimation };
