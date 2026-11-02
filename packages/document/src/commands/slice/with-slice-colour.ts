/* @layer core @kind logic */
import type { Slice } from '../../model/sprite.type';

const withSliceColour = (slice: Slice, colour: string | null | undefined): Slice => {
  if (colour === undefined) return slice;
  const { id, name, rect, pivot, center } = slice;
  const bare: Slice = { id, name, rect, pivot, center };
  return colour === null ? bare : { ...bare, colour };
};

export { withSliceColour };
