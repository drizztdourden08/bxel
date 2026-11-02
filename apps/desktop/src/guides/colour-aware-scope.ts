/* @layer renderer-app @kind logic */
import { clearGuideColours } from './clear-guide-colours';
import type { GuideScope } from './guide.type';
import { moveGuideColour } from './move-guide-colour';
import { setGuideColour } from './set-guide-colour';

const colourAwareScope = (scope: GuideScope): GuideScope => ({
  ...scope,
  move: (axis, from, to) => {
    moveGuideColour(axis, from, to);
    scope.move(axis, from, to);
  },
  remove: (axis, position) => {
    setGuideColour(axis, position, null);
    scope.remove(axis, position);
  },
  clear: () => {
    clearGuideColours();
    scope.clear();
  },
});

export { colourAwareScope };
