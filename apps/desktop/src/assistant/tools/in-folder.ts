/* @layer renderer-app @kind logic */
const inFolder = (path: string, folder: string): boolean => {
  const lower = path.toLowerCase();
  const base = folder.toLowerCase();
  return lower.startsWith(`${base}\\`) || lower.startsWith(`${base}/`);
};

export { inFolder };
