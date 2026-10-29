/* @layer core @kind logic */
const rounds = (same: (a: number, b: number) => boolean, pair: readonly [number, number, number, number]): boolean => {
  const [near, mate, far1, far2] = pair;
  return same(near, mate) && !same(far1, mate) && !same(far2, mate);
};

export { rounds };
