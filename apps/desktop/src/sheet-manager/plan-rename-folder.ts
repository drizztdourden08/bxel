/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { buildRenamePlan } from './build-rename-plan';
import { normalizeFolder } from './normalize-folder';
import type { RenamePlan } from './manager.type';

const planRenameFolder = (artwork: Artwork, path: string, next: string): RenamePlan => {
  const target = normalizeFolder(next);
  const inside = (name: string): boolean => name.startsWith(`${path}/`);
  const below = artwork.sprites.filter((sprite) => inside(sprite.name));
  const others = artwork.sprites.filter((sprite) => !inside(sprite.name)).map((sprite) => sprite.name);
  const finals = below.map((sprite) => (target === '' ? sprite.name.slice(path.length + 1) : `${target}${sprite.name.slice(path.length)}`));
  return buildRenamePlan(below, finals, others);
};

export { planRenameFolder };
