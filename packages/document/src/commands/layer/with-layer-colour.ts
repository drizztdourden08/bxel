/* @layer core @kind logic */
const withLayerColour = <Item extends { readonly colour?: string }>(item: Item, colour: string | null | undefined): Item => {
  if (colour === undefined) return item;
  const next = { ...item };
  delete (next as { colour?: string }).colour;
  return colour === null ? next : { ...next, colour };
};

export { withLayerColour };
