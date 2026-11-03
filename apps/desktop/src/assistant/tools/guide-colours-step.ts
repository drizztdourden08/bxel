/* @layer renderer-app @kind logic */
import { setGuideColour } from '../../guides/set-guide-colour';
import { currentViewKey } from '../../reference-image/current-view-key';
import { GUIDE_COLOURS_STEP_TEXT } from './guide-colours-step.constants';
import type { ViewStep } from './view-steps.type';
import { viewFail } from './view-fail';

const guideColoursStep: ViewStep = (patch) => {
  const { guideColours } = patch;
  if (!guideColours) return null;
  if (currentViewKey() === null) return viewFail(GUIDE_COLOURS_STEP_TEXT.noAsset, 'guideColours');
  for (const entry of guideColours) setGuideColour(entry.axis, entry.position, entry.colour);
  return null;
};

export { guideColoursStep };
