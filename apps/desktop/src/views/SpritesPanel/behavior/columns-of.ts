/* @layer renderer-app @kind logic */
const columnsOf = (container: HTMLElement): number => {
  const rows = new Map<number, number>();
  for (const tile of container.querySelectorAll<HTMLElement>('[data-sprite-id]')) {
    const top = Math.round(tile.getBoundingClientRect().top);
    rows.set(top, (rows.get(top) ?? 0) + 1);
  }
  return Math.max(1, ...rows.values());
};

export { columnsOf };
