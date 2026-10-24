/* @layer renderer-app @kind logic */
const minorStep = (label: number): number => {
  const decade = 10 ** Math.floor(Math.log10(label));
  const lead = Math.round(label / decade);
  return Math.max(1, label / (lead === 2 ? 2 : 5));
};

export { minorStep };
