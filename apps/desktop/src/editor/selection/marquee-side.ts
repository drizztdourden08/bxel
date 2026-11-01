/* @layer renderer-app @kind logic */
const marqueeSide = (from: number, to: number): 1 | -1 => (to < from ? -1 : 1);

export { marqueeSide };
