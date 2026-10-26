/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { AnimSpanTag, Animation } from '../../model/animation.type';
import type { TagId } from '../../model/ids.type';
import { checkName } from '../../validate/check-name';
import type { SpanTagOptions } from './anim-tag-options.type';
import { spanFrames } from './span-frames';

const buildSpanTag = (ids: IdSource, animation: Animation, options: SpanTagOptions): AnimSpanTag => ({
  kind: 'span',
  id: ids.next('tag') as TagId,
  name: checkName(options.name),
  ...spanFrames(animation, options.from, options.to),
  direction: options.direction,
  repeat: options.repeat,
  ...(options.facing === undefined ? {} : { facing: options.facing }),
  ...(options.colour === undefined ? {} : { colour: options.colour }),
});

export { buildSpanTag };
