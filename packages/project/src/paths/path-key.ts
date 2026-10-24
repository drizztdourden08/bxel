/* @layer core @kind logic */
const pathKey = (normalized: string): string => {
  const lower = normalized.toLowerCase();
  return lower.endsWith('/') ? lower : `${lower}/`;
};

export { pathKey };
