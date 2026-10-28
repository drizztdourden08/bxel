/* @layer renderer-app @kind logic */
import { POINT_LIMIT } from './stroke.constants';
import type { SpraySession } from './editor.type';
import { paintSpray } from './paint-spray';
import { sprayDots } from './spray-dots';

const tickSpray = (session: SpraySession): void => {
  const room = POINT_LIMIT - session.dots.length;
  if (room <= 0) return;
  const made = sprayDots(session.at, session.options.size, Math.min(session.options.density, room), session.state);
  session.state = made.state;
  session.dots.push(...made.dots);
  paintSpray(session);
};

export { tickSpray };
