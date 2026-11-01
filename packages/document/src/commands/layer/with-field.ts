/* @layer core @kind logic */
const withField = <Item extends object, Key extends keyof Item>(item: Item, key: Key, value: Item[Key] | undefined, fallback: Item[Key]): Item => {
  if (value === undefined || value === item[key] || (value === fallback && !(key in item))) return item;
  const next: Partial<Item> = { ...item };
  if (value === fallback) delete next[key];
  else next[key] = value;
  return next as Item;
};

export { withField };
