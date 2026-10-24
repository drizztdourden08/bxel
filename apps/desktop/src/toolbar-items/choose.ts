/* @layer renderer-app @kind logic */
const choose =
  <T extends string>(values: readonly T[], apply: (value: T) => unknown) =>
  (picked: string): void => {
    const found = values.find((each) => each === picked);
    if (found !== undefined) apply(found);
  };

export { choose };
