/* @layer renderer-app @kind logic */
import type { AnimFlip, AnimMirrorTag, AnimSpanTag } from '@bxel/document';
import type { ExportFrame, SheetTagEntry } from '@bxel/formats';
import type { AnimationWorld, SpanRange, TagBuild, TagFrames } from './animation-export.type';
import { animationFrameOf } from './animation-frame-of';
import { animationSpanRange } from './animation-span-range';
import { animationTagName } from './animation-tag-name';

const spanEntry = (world: AnimationWorld, tag: AnimSpanTag, range: SpanRange): SheetTagEntry => ({
  name: animationTagName(world.animation, tag.name, tag.facing),
  from: range.first,
  to: range.last,
  direction: tag.direction,
  repeat: tag.repeat,
  ...(tag.colour === undefined ? {} : { colour: tag.colour }),
  ...(tag.facing === undefined ? {} : { facing: tag.facing }),
});

const mirrorFrames = (world: AnimationWorld, range: SpanRange, flip: AnimFlip): ExportFrame[] =>
  Array.from({ length: range.last - range.first + 1 }, (_, step) => animationFrameOf(world, range.first + step, flip)).flat();

const mirrorBuild = (world: AnimationWorld, tag: AnimMirrorTag, base: AnimSpanTag, start: number): TagFrames => {
  const range = animationSpanRange(world.animation, base);
  if (!range) return { tags: [], extra: [] };
  const extra = mirrorFrames(world, range, tag.flip);
  const entry: SheetTagEntry = {
    ...spanEntry(world, base, { first: start, last: start + extra.length - 1 }),
    name: animationTagName(world.animation, base.name, tag.facing),
    facing: tag.facing,
    mirrorOf: animationTagName(world.animation, base.name, base.facing),
    flip: tag.flip,
  };
  return { tags: [{ id: tag.id, entry }], extra };
};

const spanBuild = (world: AnimationWorld, tag: AnimSpanTag): TagBuild[] => {
  const range = animationSpanRange(world.animation, tag);
  return range ? [{ id: tag.id, entry: spanEntry(world, tag, range) }] : [];
};

const animationTagFrames = (world: AnimationWorld): TagFrames => {
  const { animation } = world;
  const tags: TagBuild[] = [];
  const extra: ExportFrame[] = [];
  for (const tag of animation.tags) {
    if (tag.kind === 'span') {
      tags.push(...spanBuild(world, tag));
      continue;
    }
    const base = animation.tags.find((item) => item.id === tag.of);
    if (base?.kind !== 'span') continue;
    const built = mirrorBuild(world, tag, base, animation.frames.length + extra.length);
    tags.push(...built.tags);
    extra.push(...built.extra);
  }
  return { tags, extra };
};

export { animationTagFrames };
