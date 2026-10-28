/* @layer renderer-app @kind logic */
const mainButton = (row: Element | undefined): HTMLElement | null =>
  [...(row?.querySelectorAll<HTMLElement>('button') ?? [])].find((button) => !button.closest('[data-reorder-toggles]')) ?? null;

export { mainButton };
