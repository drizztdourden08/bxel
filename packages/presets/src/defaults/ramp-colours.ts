/* @layer core @kind logic */

const rampColours = (count: number): number[] =>
  Array.from({ length: count }, (_unused, index) => {
    const grey = count > 1 ? Math.round((255 * index) / (count - 1)) : 0;
    return (grey << 16) | (grey << 8) | grey;
  });

export { rampColours };
