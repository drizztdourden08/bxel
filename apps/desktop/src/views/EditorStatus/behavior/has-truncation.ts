/* @layer renderer-app @kind logic */
const SLACK = 0.5;

const textWidth = (element: HTMLElement): number => {
  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element);
  return range.getBoundingClientRect().width;
};

const isClipped = (element: HTMLElement): boolean => element.children.length === 0 && textWidth(element) > element.getBoundingClientRect().width + SLACK;

const hasTruncation = (zone: HTMLElement | null): boolean => {
  if (!zone) return false;
  return [...zone.querySelectorAll<HTMLElement>('dt span, dd span')].some(isClipped);
};

export { hasTruncation };
