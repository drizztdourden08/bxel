/* @layer renderer-app @kind logic */
const columnsOf = (container: HTMLElement): number => {
  const tiles = Array.from(container.querySelectorAll<HTMLElement>('[data-sprite-id]'));
  const first = tiles[0];
  if (!first) return 1;
  const row = tiles.filter((tile) => tile.offsetTop === first.offsetTop).length;
  return Math.max(1, row);
};

export { columnsOf };
