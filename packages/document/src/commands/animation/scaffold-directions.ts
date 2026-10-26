/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimFacing, AnimSpanTag, AnimTag } from '../../model/animation.type';
import { FACING_SETS, MIRROR_FACING } from '../../model/animation.constants';
import type { TagId } from '../../model/ids.type';
import type { AnimationDirectionsOptions } from '../../schema/animation-options.type';
import { checkName } from '../../validate/check-name';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { buildAnimFrame } from './build-anim-frame';
import type { Scaffold } from './scaffold-directions.type';

const checkMirrored = (options: AnimationDirectionsOptions): void => {
  const facings = FACING_SETS[options.mode];
  for (const facing of options.mirrored) {
    const partner = MIRROR_FACING[facing];
    const valid = facings.includes(facing) && partner !== undefined && facings.includes(partner) && !options.mirrored.includes(partner);
    if (!valid) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Facing "${facing}" cannot be a mirror in the ${options.mode} direction set.`, { path: 'options.mirrored' });
    }
  }
};

const scaffoldDirections = (draft: Draft, options: AnimationDirectionsOptions): Scaffold => {
  checkMirrored(options);
  const name = checkName(options.tag);
  const drawn = FACING_SETS[options.mode].filter((facing) => !options.mirrored.includes(facing));
  const frames = drawn.flatMap(() =>
    Array.from({ length: options.framesPerFacing }, () => buildAnimFrame(draft.ids, { spriteId: null }, { durationMs: options.durationMs })),
  );
  const spans = new Map<AnimFacing, AnimSpanTag>();
  for (const [index, facing] of drawn.entries()) {
    const first = frames[index * options.framesPerFacing];
    const last = frames[(index + 1) * options.framesPerFacing - 1];
    if (first && last) {
      spans.set(facing, { kind: 'span', id: draft.ids.next('tag') as TagId, name, from: first.id, to: last.id, direction: 'forward', repeat: 0, facing });
    }
  }
  const mirrors = options.mirrored.flatMap((facing): AnimTag[] => {
    const partner = MIRROR_FACING[facing];
    const base = partner === undefined ? undefined : spans.get(partner);
    return base ? [{ kind: 'mirror', id: draft.ids.next('tag') as TagId, of: base.id, flip: 'x', facing }] : [];
  });
  return { frames, tags: [...spans.values(), ...mirrors] };
};

export { scaffoldDirections };
