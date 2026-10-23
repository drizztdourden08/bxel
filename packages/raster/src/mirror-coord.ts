/* @layer core @kind logic */
import { stampOffset } from './stamp-offset';

const mirrorCoord = (value: number, axis2: number, span: number): number =>
  axis2 - span - value + 2 * stampOffset(span);

export { mirrorCoord };
