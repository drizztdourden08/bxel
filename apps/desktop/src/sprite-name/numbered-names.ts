/* @layer renderer-app @kind logic */
const numberWidth = (count: number): number => Math.max(2, String(count).length);

const numbered = (pattern: string, index: number, count: number): string =>
  pattern.replace('{n}', String(index + 1).padStart(numberWidth(count), '0'));

const numberedNames = (pattern: string, count: number): string[] => {
  const template = pattern.includes('{n}') ? pattern : `${pattern}_{n}`;
  return Array.from({ length: count }, (_, index) => numbered(template, index, count));
};

export { numberedNames };
