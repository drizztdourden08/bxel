/* @layer renderer-app @kind logic */
const pathChain = (path: string): string[] => {
  const parts = path.split('/');
  return parts.map((_part, at) => parts.slice(0, at + 1).join('/'));
};

export { pathChain };
