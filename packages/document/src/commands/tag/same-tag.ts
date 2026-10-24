/* @layer core @kind logic */
import type { Tag } from '../../model/sprite.type';

const sameTag = (first: Tag, second: Tag): boolean =>
  first.name === second.name &&
  first.from === second.from &&
  first.to === second.to &&
  first.direction === second.direction &&
  first.repeat === second.repeat &&
  first.colour === second.colour;

export { sameTag };
