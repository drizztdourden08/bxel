/* @layer core @kind logic */

const findDuplicates = (table: Int32Array): number[][] => {
  const groups = new Map<number, number[]>();
  for (const [slot, rgb] of table.entries()) {
    if (rgb < 0) continue;
    const group = groups.get(rgb);
    if (group) group.push(slot);
    else groups.set(rgb, [slot]);
  }
  return [...groups.values()].filter((group) => group.length > 1);
};

export { findDuplicates };
