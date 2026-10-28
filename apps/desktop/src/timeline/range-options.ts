/* @layer renderer-app @kind logic */
import type { Animation } from '@bxel/document';
import type { RangeOption } from './range-options.type';
import { spanTagOf } from './span-tag-of';
import { TIMELINE_TEXT } from './timeline.constants';

const rangeOptions = (animation: Animation, loop: boolean): RangeOption[] => [
  { value: '', label: TIMELINE_TEXT.wholeAnimation },
  { value: '@picked', label: TIMELINE_TEXT.pickedFrames },
  ...(loop ? [{ value: '@loop', label: TIMELINE_TEXT.loopRangeName }] : []),
  ...animation.tags.flatMap((tag) => {
    const base = spanTagOf(animation, tag);
    return base ? [{ value: tag.id, label: tag.kind === 'mirror' ? `${base.name} (${tag.facing})` : base.name }] : [];
  }),
];

export { rangeOptions };
