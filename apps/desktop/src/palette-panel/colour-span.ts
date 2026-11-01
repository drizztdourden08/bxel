/* @layer renderer-app @kind logic */
const colourSpan = (from: number, to: number): number[] => {
  const low = Math.min(from, to);
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, at) => low + at);
};

export { colourSpan };
