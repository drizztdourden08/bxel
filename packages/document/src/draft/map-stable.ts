/* @layer core @kind logic */
const mapStable = <Item>(items: readonly Item[], change: (item: Item) => Item): readonly Item[] => {
  const next = items.map(change);
  return next.some((item, index) => item !== items[index]) ? next : items;
};

export { mapStable };
