/* @layer renderer-app @kind logic */
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import type { RenamePlan } from './manager.type';
import { renameSteps } from './rename-steps';

const renameSprites = (plan: RenamePlan): boolean => {
  const artwork = currentArtwork();
  if (!artwork || !plan.ok) return false;
  const steps = renameSteps(plan.entries, artwork.sprites.map((sprite) => sprite.name));
  return runDocument(LABEL.rename(plan.changed), steps) !== null;
};

export { renameSprites };
