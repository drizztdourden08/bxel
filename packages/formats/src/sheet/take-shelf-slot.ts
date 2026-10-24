/* @layer core @kind logic */
import type { Shelf, ShelfSlot } from './sheet.type';

const takeShelfSlot = (
  shelves: Shelf[],
  size: { readonly width: number; readonly height: number },
  padding: number,
  usable: number,
): ShelfSlot => {
  const open = shelves.find(
    (shelf) => shelf.used + (shelf.used > 0 ? padding : 0) + size.width <= usable,
  );
  const last = shelves.at(-1);
  const shelf = open ?? { y: last ? last.y + last.height + padding : 0, height: size.height, used: 0 };
  if (!open) shelves.push(shelf);
  const x = shelf.used > 0 ? shelf.used + padding : 0;
  shelf.used = x + size.width;
  return { x, shelf };
};

export { takeShelfSlot };
