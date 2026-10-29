/* @layer renderer-app @kind logic */
const focusCell = (from: HTMLElement, index: number): void => {
  const grid = from.closest<HTMLElement>('[role="grid"]');
  grid?.querySelector<HTMLElement>(`[data-grid-index="${index}"]`)?.focus();
};

export { focusCell };
