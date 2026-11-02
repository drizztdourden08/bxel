/* @layer renderer-app @kind logic */
import { currentGuideColours } from './current-guide-colours';
import { guideColourKey } from './guide-colour-key';
import type { GuideAxis } from './guide.type';
import { setGuideColour } from './set-guide-colour';

const moveGuideColour = (axis: GuideAxis, from: number, to: number): void => {
  const colour = currentGuideColours()[guideColourKey(axis, from)];
  if (colour === undefined) return;
  setGuideColour(axis, from, null);
  setGuideColour(axis, to, colour);
};

export { moveGuideColour };
