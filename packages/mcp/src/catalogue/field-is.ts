/* @layer core @kind logic */
const fieldIs =
  (field: string, value: unknown) =>
  (input: unknown): boolean =>
    typeof input === 'object' && input !== null && Reflect.get(input, field) === value;

export { fieldIs };
