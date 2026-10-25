/* @layer renderer-app @kind logic */
const isShown = (element: HTMLElement): boolean => element.getClientRects().length > 0 && element.closest('[aria-hidden="true"], [inert], [hidden]') === null;

export { isShown };
