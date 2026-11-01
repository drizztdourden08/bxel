/* @layer renderer-app @kind logic */
import { revealInProjectWindow } from '../../project-browser/reveal-in-project-window';
import { locationPath } from './location-path';
import { reply } from './reply';
import type { ViewStep } from './view-steps.type';

const revealStep: ViewStep = (patch, context) => {
  const { reveal } = patch;
  if (!reveal) return null;
  const path = locationPath(context, reveal, 'reveal');
  if (!path.ok) return reply(path);
  revealInProjectWindow(path.value);
  return null;
};

export { revealStep };
