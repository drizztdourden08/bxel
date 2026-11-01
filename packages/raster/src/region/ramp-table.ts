/* @layer core @kind logic */
const stepTarget = (position: number, from: number, to: readonly number[]): number | undefined => {
  if (to.length === 1 || from === 1) return to[0];
  return to[Math.round((position * (to.length - 1)) / (from - 1))];
};

const rampTable = (from: readonly number[], to: readonly number[]): Map<number, number> => {
  const table = new Map<number, number>();
  from.forEach((slot, position) => {
    const target = stepTarget(position, from.length, to);
    if (target !== undefined && target !== slot) table.set(slot, target);
  });
  return table;
};

export { rampTable };
