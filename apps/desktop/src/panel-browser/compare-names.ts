/* @layer renderer-app @kind logic */
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const compareNames = (left: string, right: string): number => collator.compare(left, right) || left.localeCompare(right);

export { compareNames };
