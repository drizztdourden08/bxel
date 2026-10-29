/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { GradientSession } from './editor.type';
import { paintGradient } from './paint-gradient';
import { ratioSnap } from './ratio-snap';

const updateGradient = (session: GradientSession, at: Point, constrain: boolean): void => {
  const { from, to } = session.spec.line;
  const snapped = constrain ? ratioSnap(from, at) : { to: at, label: '' };
  session.label = snapped.label;
  if (snapped.to.x === to.x && snapped.to.y === to.y) return;
  session.spec = { ...session.spec, line: { from, to: snapped.to } };
  paintGradient(session);
};

export { updateGradient };
