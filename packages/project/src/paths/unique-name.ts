/* @layer core @kind logic */
const unique = (stem: string, suffix: string, taken: ReadonlySet<string>): string => {
  let name = `${stem}${suffix}`;
  for (let count = 2; taken.has(name.toLowerCase()); count += 1) name = `${stem} ${count}${suffix}`;
  return name;
};

const uniqueName = (stem: string, suffix: string, taken: Set<string>): string => {
  const name = unique(stem, suffix, taken);
  taken.add(name.toLowerCase());
  return name;
};

export { uniqueName };
