/* @layer renderer-app @kind logic */
const gapFor = (from: number, to: number): number => (to > from ? to + 1 : to);

export { gapFor };
