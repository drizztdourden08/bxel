/* @layer renderer-app @kind logic */
const nextCursor = (length: number, cursor: number, loop: boolean): number | null => {
  const next = cursor + 1;
  if (next < length) return next;
  return loop && length > 1 ? 0 : null;
};

export { nextCursor };
