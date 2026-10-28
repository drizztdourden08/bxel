/* @layer renderer-app @kind logic */
const uniqueName = (taken: readonly string[], base: string): string => {
  const used = new Set(taken.map((each) => each.toLowerCase()));
  let candidate = base;
  for (let number = 2; used.has(candidate.toLowerCase()); number += 1) candidate = `${base} ${number}`;
  return candidate;
};

export { uniqueName };
