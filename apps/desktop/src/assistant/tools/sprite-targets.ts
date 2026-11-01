/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { NO_TARGETS } from './sprite-targets.constants';
import type { Targets } from './sprite-targets.type';

const spriteTargets = (artwork: Artwork, wanted: readonly string[] | undefined, fallback: readonly string[]): Targets => {
  const ids = wanted ?? fallback;
  const unknown = ids.find((id) => !artwork.sprites.some((sprite) => sprite.id === id));
  if (unknown !== undefined) return { ok: false, problem: `There is no sprite ${unknown}. Call get_document for the sprite ids.` };
  const set = new Set(ids);
  const sprites = artwork.sprites.filter((sprite) => set.has(sprite.id));
  return sprites.length === 0 ? { ok: false, problem: NO_TARGETS } : { ok: true, sprites };
};

export { spriteTargets };
