/* @layer renderer-app @kind logic */
import type { Animation } from '@bxel/document';
import { FACING_TEXT, TIMELINE_TEXT } from './timeline.constants';

type TagOption = { readonly value: string; readonly label: string };

const tagOptions = (animation: Animation): readonly TagOption[] => [
  { value: '', label: TIMELINE_TEXT.wholeAnimation },
  ...animation.tags.flatMap((tag): TagOption[] => {
    if (tag.kind === 'span') return [{ value: tag.id, label: tag.facing === undefined ? tag.name : `${tag.name} (${FACING_TEXT[tag.facing]})` }];
    const base = animation.tags.find((item) => item.id === tag.of);
    return base?.kind === 'span' ? [{ value: tag.id, label: `${base.name} (${FACING_TEXT[tag.facing]}, mirrored)` }] : [];
  }),
];

export { tagOptions };
