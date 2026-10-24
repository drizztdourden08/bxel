/* @layer renderer-app @kind logic */
const columnsOf = (container: HTMLElement): number => {
  const rows = new Map<number, number>();
  for (const tile of container.querySelectorAll<HTMLElement>('[data-sprite-id]')) {
    rows.set(tile.offsetTop, (rows.get(tile.offsetTop) ?? 0) + 1);
  }
  return Math.max(1, ...rows.values());
};

export { columnsOf };
