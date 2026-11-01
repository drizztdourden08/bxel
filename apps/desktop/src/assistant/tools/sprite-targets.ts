/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';

type Targets = { readonly ok: true; readonly sprites: readonly Sprite[] } | { readonly ok: false; readonly problem: string };

const NO_TARGETS = 'No sprite is picked. Give sprites, or pick them in the sheet manager.';

const spriteTargets = (artwork: Artwork, wanted: readonly string[] | undefined, fallback: readonly string[]): Targets => {
  const ids = wanted ?? fallback;
  const unknown = ids.find((id) => !artwork.sprites.some((sprite) => sprite.id === id));
  if (unknown !== undefined) return { ok: false, problem: `There is no sprite ${unknown}. Call get_document for the sprite ids.` };
  const set = new Set(ids);
  const sprites = artwork.sprites.filter((sprite) => set.has(sprite.id));
  return sprites.length === 0 ? { ok: false, problem: NO_TARGETS } : { ok: true, sprites };
};

const otherNames = (artwork: Artwork, targets: readonly Sprite[], copying: boolean): string[] => {
  const picked = new Set(copying ? [] : targets.map((sprite) => sprite.id));
  return artwork.sprites.filter((sprite) => !picked.has(sprite.id)).map((sprite) => sprite.name);
};

export type { Targets };
export { otherNames, spriteTargets };
