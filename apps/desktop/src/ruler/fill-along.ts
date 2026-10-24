/* @layer renderer-app @kind logic */
import type { AlongRect, RulerFrame } from './ruler.type';
import { rulerPoint } from './ruler-point';

const fillAlong = (frame: RulerFrame, rect: AlongRect): void => {
  const [x, y] = rulerPoint(frame.axis, rect.along, rect.across);
  const [width, height] = rulerPoint(frame.axis, rect.alongSize, rect.acrossSize);
  frame.ctx.fillRect(x, y, width, height);
};

export { fillAlong };
