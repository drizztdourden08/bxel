/* @layer core @kind logic */
const resolvedChange = <Value>(change: Value | null | undefined, current: Value | undefined): Value | undefined =>
  change === undefined ? current : (change ?? undefined);

export { resolvedChange };
