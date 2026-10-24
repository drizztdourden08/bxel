/* @layer renderer-app @kind logic */
const spanBetween = <Id extends string>(ids: readonly Id[], first: Id, second: Id): Id[] => {
  const from = ids.indexOf(first);
  const to = ids.indexOf(second);
  if (from < 0 || to < 0) return [];
  return ids.slice(Math.min(from, to), Math.max(from, to) + 1);
};

export { spanBetween };
