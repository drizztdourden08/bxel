/* @layer core @kind logic */
const sharedDepth = (directory: readonly string[], target: readonly string[]): number => {
  let depth = 0;
  while (depth < directory.length && depth < target.length - 1 && directory[depth] === target[depth]) depth += 1;
  return depth;
};

const relativeLinkPath = (from: string, to: string): string => {
  const directory = from.split('/').slice(0, -1);
  const target = to.split('/');
  const shared = sharedDepth(directory, target);
  const climbs = directory.slice(shared).map(() => '..');
  return [...climbs, ...target.slice(shared)].join('/');
};

export { relativeLinkPath };
