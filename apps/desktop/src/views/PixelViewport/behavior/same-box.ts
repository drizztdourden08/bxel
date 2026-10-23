/* @layer renderer-app @kind logic */
import type { ViewBox } from './viewport.type';

const sameBox = (a: ViewBox, b: ViewBox): boolean => a.width === b.width && a.height === b.height && a.dpr === b.dpr
  && a.margin === b.margin && a.step === b.step;

export { sameBox };
