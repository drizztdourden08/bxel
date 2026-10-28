/* @layer renderer-app @kind logic */
const focusSwatch = (list: HTMLElement | null, index: number): void => {
  list?.querySelector<HTMLElement>(`[data-swatch-index="${index}"]`)?.focus();
};

export { focusSwatch };
