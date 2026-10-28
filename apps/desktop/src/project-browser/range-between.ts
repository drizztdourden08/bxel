/* @layer renderer-app @kind logic */

const rangeBetween = (order: readonly string[], from: string, to: string): readonly string[] => {
  const start = order.indexOf(from);
  const end = order.indexOf(to);
  if (start < 0 || end < 0) return [to];
  return order.slice(Math.min(start, end), Math.max(start, end) + 1);
};

export { rangeBetween };
