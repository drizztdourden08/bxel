/* @layer renderer-app @kind logic */
const focusFirstField = (node: HTMLElement | null): void => {
  const field = node?.querySelector<HTMLInputElement>('input');
  field?.focus();
  field?.select();
};

export { focusFirstField };
