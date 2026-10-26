/* @layer core @kind logic */
import { freeName } from '../../commands/layer/free-name';
import type { IdSource } from '../../ids/id-source.type';
import { DEFAULT_ANIM_LOOP, DEFAULT_DIRECTION_PATTERN } from '../../model/animation.constants';
import type { AnimFrame, AnimTag, Animation } from '../../model/animation.type';
import type { AnimationId, AnimFrameId, TagId } from '../../model/ids.type';
import type { Sprite } from '../../model/sprite.type';
import type { BuiltAnimation, Naming } from './animated-split.type';
import { frameSignature } from './frame-signature';
import { frameSprite } from './frame-sprite';

const ownedSprites = (ids: IdSource, source: Sprite, naming: Naming): Map<string, Sprite> => {
  const made = new Map<string, Sprite>();
  const names = [...naming.taken];
  for (const frame of source.frames) {
    const signature = frameSignature(source, frame);
    if (made.has(signature)) continue;
    const name = freeName(names, `${naming.animation}_${made.size + 1}`);
    names.push(name);
    made.set(signature, frameSprite(ids, source, frame, name));
  }
  return made;
};

const tagsOf = (ids: IdSource, source: Sprite, frameIds: ReadonlyMap<string, AnimFrameId>): AnimTag[] =>
  source.tags.flatMap((tag): AnimTag[] => {
    const from = frameIds.get(tag.from);
    const to = frameIds.get(tag.to);
    if (!from || !to) return [];
    return [
      {
        kind: 'span',
        id: ids.next('tag') as TagId,
        name: tag.name,
        from,
        to,
        direction: tag.direction,
        repeat: tag.repeat,
        ...(tag.colour === undefined ? {} : { colour: tag.colour }),
      },
    ];
  });

const framesOf = (source: Sprite, frameIds: ReadonlyMap<string, AnimFrameId>, made: ReadonlyMap<string, Sprite>): AnimFrame[] =>
  source.frames.flatMap((frame): AnimFrame[] => {
    const id = frameIds.get(frame.id);
    const sprite = made.get(frameSignature(source, frame));
    return id && sprite
      ? [{ id, spriteId: sprite.id, clip: null, durationMs: frame.durationMs, offset: { x: 0, y: 0 }, pivot: null }]
      : [];
  });

const buildAnimation = (ids: IdSource, source: Sprite, naming: Naming): BuiltAnimation => {
  const made = ownedSprites(ids, source, naming);
  const frameIds = new Map(source.frames.map((frame) => [frame.id, ids.next('afr') as AnimFrameId] as const));
  const animation: Animation = {
    id: ids.next('anm') as AnimationId,
    name: naming.animation,
    ...(source.created === undefined ? {} : { created: source.created }),
    bankId: source.bankId,
    width: source.width,
    height: source.height,
    anchor: source.pivot,
    loop: DEFAULT_ANIM_LOOP,
    directions: 'none',
    directionPattern: DEFAULT_DIRECTION_PATTERN,
    frames: framesOf(source, frameIds, made),
    tags: tagsOf(ids, source, frameIds),
  };
  return { animation, sprites: [...made.values()] };
};

export { buildAnimation };
