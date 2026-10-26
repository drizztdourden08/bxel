/* @layer renderer-app @kind logic */
const focusField = (label: string): void => {
  const field = [...document.querySelectorAll<HTMLInputElement>('input')].find((each) => each.getAttribute('aria-label') === label);
  field?.focus();
  field?.select();
};

export { focusField };
