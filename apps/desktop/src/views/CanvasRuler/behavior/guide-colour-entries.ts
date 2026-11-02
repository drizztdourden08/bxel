/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { currentGuideColours } from '../../../guides/current-guide-colours';
import { guideColourKey } from '../../../guides/guide-colour-key';
import { GUIDE_COLOUR_TEXT, GUIDE_COLOURS } from '../../../guides/guide.constants';
import type { GuideAxis } from '../../../guides/guide.type';

const guideColourEntries = (axis: GuideAxis, line: number | null): ContextMenuEntry => {
  const current = line === null ? undefined : currentGuideColours()[guideColourKey(axis, line)];
  const gate = unless(line !== null, GUIDE_COLOUR_TEXT.none);
  const args = (colour: string | null) => ({ axis, position: line ?? 0, colour });
  return {
    label: GUIDE_COLOUR_TEXT.menu,
    disabled: line === null,
    items: [
      ...GUIDE_COLOURS.map(({ name, colour }) => ({ command: 'guide.colour', label: name, args: args(colour), kind: 'radio' as const, checked: current === colour, ...gate })),
      { command: 'guide.colour', label: GUIDE_COLOUR_TEXT.reset, args: args(null), kind: 'radio' as const, checked: current === undefined, ...gate },
    ],
  };
};

export { guideColourEntries };
