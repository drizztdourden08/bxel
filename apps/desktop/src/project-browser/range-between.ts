/* @layer renderer-app @kind logic */

const rangeBetween = (order: readonly string[], from: string, to: string): readonly string[] => {
  const ends = [order.indexOf(from), order.indexOf(to)];
  if (ends.includes(-1)) return [to];
  return order.slice(Math.min(...ends), Math.max(...ends) + 1);
};

export { rangeBetween };
