/* @layer renderer-app @kind logic */
const uniquePath = (dir: string, stem: string, extension: string, taken: ReadonlySet<string>): string => {
  let path = `${dir}/${stem}${extension}`;
  for (let count = 2; taken.has(path.toLowerCase()); count += 1) path = `${dir}/${stem} ${count}${extension}`;
  return path;
};

export { uniquePath };
