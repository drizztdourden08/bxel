/* @layer renderer-app @kind logic */
const moveItem = <T>(items: readonly T[], from: number, to: number): readonly T[] => {
  const moved = items[from];
  if (moved === undefined || to < 0 || to >= items.length) return items;
  const rest = items.filter((_item, index) => index !== from);
  return [...rest.slice(0, to), moved, ...rest.slice(to)];
};

export { moveItem };
