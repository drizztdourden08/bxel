/* @layer core @kind logic */
import type { Tag } from '../../model/sprite.type';

const withoutColour = (tag: Tag): Tag => {
  const { id, name, from, to, direction, repeat } = tag;
  return { id, name, from, to, direction, repeat };
};

const withColour = (tag: Tag, colour: string | null | undefined): Tag => {
  if (colour === undefined) return tag;
  const bare = withoutColour(tag);
  return colour === null ? bare : { ...bare, colour };
};

export { withColour };
