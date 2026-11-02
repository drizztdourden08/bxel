/* @layer renderer-app @kind logic */
import { ANNOUNCE_TEXT } from '../announce/announce.constants';
import { commitSession } from './commit-session';
import type { ShapePress } from './press-shape.type';
import { shapeCentre } from './shape-centre';
import { startSession } from './start-session';
import { updateGradient } from './update-gradient';
import { updateShape } from './update-shape';

const pressShape = ({ target, plan, at, constrain, anchor }: ShapePress): string => {
  const from = anchor.current;
  if (from === null) {
    anchor.current = at;
    return ANNOUNCE_TEXT.shapeStarted(at.x, at.y);
  }
  anchor.current = null;
  const session = startSession(plan, target, from);
  if (session.kind === 'shape') updateShape(session, at, { constrain, centre: shapeCentre(false), move: false });
  if (session.kind === 'gradient') updateGradient(session, at, constrain);
  commitSession(session);
  return ANNOUNCE_TEXT.shapeDone;
};

export { pressShape };
