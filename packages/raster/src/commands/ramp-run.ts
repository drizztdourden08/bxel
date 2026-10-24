/* @layer core @kind logic */
const rampRun = (slots: readonly number[], first: number | undefined, last: number | undefined): number[] => {
  const from = first ?? 0;
  const to = last ?? slots.length - 1;
  const step = from <= to ? 1 : -1;
  const run: number[] = [];
  for (let at = from; at !== to + step; at += step) {
    run.push(slots[at] ?? 0);
  }
  return run;
};

export { rampRun };
