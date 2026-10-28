/* @layer renderer-app @kind logic */
const known = new WeakMap<object, number>();

let next = 0;

const objectId = (value: object | undefined): number => {
  if (value === undefined) return 0;
  const found = known.get(value);
  if (found !== undefined) return found;
  next += 1;
  known.set(value, next);
  return next;
};

export { objectId };
