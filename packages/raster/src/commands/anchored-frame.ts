/* @layer core @kind logic */
import type { Rect, Size } from '../geometry.type';
import { ANCHOR_SHARE, CENTER_SHARE } from './resize-anchor.constants';

const anchoredFrame = (from: Size, to: Size, anchor: string): Rect => {
  const share = ANCHOR_SHARE[anchor] ?? CENTER_SHARE;
  const x = Math.floor((to.width - from.width) * share.x);
  const y = Math.floor((to.height - from.height) * share.y);
  return { x: -x, y: -y, width: to.width, height: to.height };
};

export { anchoredFrame };
