/* @layer core @kind logic */
const fileStem = (path: string): string => {
  const file = path.split('/').pop() ?? '';
  const dot = file.lastIndexOf('.');
  return dot > 0 ? file.slice(0, dot) : file;
};

export { fileStem };
