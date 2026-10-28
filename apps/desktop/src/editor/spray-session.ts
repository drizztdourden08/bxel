/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { POINT_LIMIT } from './stroke.constants';
import { createOverlay } from './create-overlay';
import type { EditorTarget, SprayOptions, SpraySession } from './editor.type';
import { paintSpray } from './paint-spray';
import { sprayDots } from './spray-dots';

type SprayStart = { readonly target: EditorTarget; readonly index: number; readonly options: SprayOptions; readonly seed: number; readonly at: Point };

const tickSpray = (session: SpraySession): void => {
  const room = POINT_LIMIT - session.dots.length;
  if (room <= 0) return;
  const made = sprayDots(session.at, session.options.size, Math.min(session.options.density, room), session.state);
  session.state = made.state;
  session.dots.push(...made.dots);
  paintSpray(session);
};

const beginSpray = ({ target, index, options, seed, at }: SprayStart): SpraySession => {
  const session: SpraySession = { ...createOverlay(target), kind: 'spray', index, options, seed, state: seed, at, dots: [] };
  tickSpray(session);
  return session;
};

const moveSpray = (session: SpraySession, at: Point): void => {
  session.at = at;
};

export { beginSpray, moveSpray, tickSpray };
