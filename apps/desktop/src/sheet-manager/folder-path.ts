/* @layer renderer-app @kind logic */
const folderPath = (name: string): string => {
  const at = name.lastIndexOf('/');
  return at < 0 ? '' : name.slice(0, at).trim();
};

export { folderPath };
