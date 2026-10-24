/* @layer core @kind logic */
import type { Draft, SpriteId } from '@bxel/document';

const takenNames = (draft: Draft, ids: readonly SpriteId[], keep: boolean): string[] =>
  draft.artwork.sprites.filter((sprite) => keep || !ids.includes(sprite.id)).map((sprite) => sprite.name);

export { takenNames };
