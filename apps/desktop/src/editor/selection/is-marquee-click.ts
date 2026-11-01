/* @layer renderer-app @kind logic */
import type { DragShape, MarqueeRule } from './selection.type';

const isMarqueeClick = (shape: DragShape, rule: MarqueeRule): boolean => {
  const stamps = rule.fixed === 'size' && (shape.variant === 'rect' || shape.variant === 'ellipse');
  return !stamps && shape.from.x === shape.to.x && shape.from.y === shape.to.y;
};

export { isMarqueeClick };
