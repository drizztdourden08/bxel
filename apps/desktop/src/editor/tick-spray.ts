/* @layer renderer-app @kind logic */
import { POINT_LIMIT } from './stroke.constants';
import type { SpraySession } from './editor.type';
import { paintSpray } from './paint-spray';
import { sprayDots } from './spray-dots';

const dotsFor = (session: SpraySession): number => Math.max(1, Math.round(session.options.density * session.pressure));

const tickSpray = (session: SpraySession): void => {
  const room = POINT_LIMIT - session.dots.length;
  if (room <= 0) return;
  const made = sprayDots(session.at, session.options.size, Math.min(dotsFor(session), room), session.state);
  session.state = made.state;
  session.dots.push(...made.dots);
  paintSpray(session);
};

export { tickSpray };
