/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { AnimTag, Animation } from '../model/animation.type';
import { FACING_SETS } from '../model/animation.constants';
import { nameKey } from '../validate/name-key';

const broken = (animation: Animation, message: string) =>
  fail(ERROR_CODE.REFERENCE_BROKEN, `Animation "${animation.name}": ${message}`);

const tagKey = (animation: Animation, tag: AnimTag): string => {
  if (tag.kind === 'span') return `${nameKey(tag.name)}|${tag.facing ?? ''}`;
  const base = animation.tags.find((item) => item.id === tag.of);
  return `${base?.kind === 'span' ? nameKey(base.name) : ''}|${tag.facing}`;
};

const checkSpan = (animation: Animation, tag: AnimTag, order: ReadonlyMap<string, number>): void => {
  if (tag.kind !== 'span') return;
  const from = order.get(tag.from);
  const to = order.get(tag.to);
  if (from === undefined || to === undefined || from > to) throw broken(animation, `tag "${tag.name}" needs a span of its frames.`);
  if (!Number.isInteger(tag.repeat) || tag.repeat < 0) throw broken(animation, `tag "${tag.name}" needs a repeat of 0 or more.`);
};

const checkMirror = (animation: Animation, tag: AnimTag): void => {
  if (tag.kind !== 'mirror') return;
  const base = animation.tags.find((item) => item.id === tag.of);
  if (base?.kind !== 'span') throw broken(animation, 'a mirror tag needs a span tag to mirror.');
};

const checkFacing = (animation: Animation, tag: AnimTag): void => {
  if (tag.facing === undefined) return;
  if (!FACING_SETS[animation.directions].includes(tag.facing)) {
    throw broken(animation, `facing "${tag.facing}" is not in the ${animation.directions === 'none' ? 'direction set (none)' : `${animation.directions} direction set`}.`);
  }
};

const checkAnimTags = (animation: Animation): void => {
  const order = new Map(animation.frames.map((frame, index) => [frame.id, index] as const));
  const ids = new Set<string>();
  const keys = new Set<string>();
  for (const tag of animation.tags) {
    checkSpan(animation, tag, order);
    checkMirror(animation, tag);
    checkFacing(animation, tag);
    const key = tagKey(animation, tag);
    if (ids.has(tag.id) || keys.has(key)) {
      throw fail(ERROR_CODE.NAME_TAKEN, `Animation "${animation.name}" already has a tag with that name and facing.`);
    }
    ids.add(tag.id);
    keys.add(key);
  }
};

export { checkAnimTags };
