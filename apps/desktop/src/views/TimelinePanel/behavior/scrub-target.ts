/* @layer renderer-app @kind logic */

const scrubTarget = (key: string, current: number, last: number): number | null => {
  if (key === 'ArrowLeft') return current - 1;
  if (key === 'ArrowRight') return current + 1;
  if (key === 'Home') return 0;
  if (key === 'End') return last;
  return null;
};

export { scrubTarget };
