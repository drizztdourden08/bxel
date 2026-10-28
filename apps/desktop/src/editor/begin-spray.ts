/* @layer renderer-app @kind logic */
import { createOverlay } from './create-overlay';
import type { SpraySession } from './editor.type';
import type { SprayStart } from './spray-session.type';
import { tickSpray } from './tick-spray';

const beginSpray = ({ target, index, options, seed, at }: SprayStart): SpraySession => {
  const session: SpraySession = { ...createOverlay(target), kind: 'spray', index, options, seed, state: seed, at, dots: [] };
  tickSpray(session);
  return session;
};

export { beginSpray };
