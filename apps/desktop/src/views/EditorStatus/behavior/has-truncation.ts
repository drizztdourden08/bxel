/* @layer renderer-app @kind logic */
import { CLIP_SLACK } from './has-truncation.constants';

const textWidth = (element: HTMLElement): number => {
  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element);
  return range.getBoundingClientRect().width;
};

const isClipped = (element: HTMLElement): boolean => element.children.length === 0 && textWidth(element) > element.getBoundingClientRect().width + CLIP_SLACK;

const hasTruncation = (zone: HTMLElement | null): boolean => {
  if (!zone) return false;
  return [...zone.querySelectorAll<HTMLElement>('dt span, dd span')].some(isClipped);
};

export { hasTruncation };
