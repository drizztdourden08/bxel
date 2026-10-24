/* @layer renderer-app @kind logic */
import { snapAxis } from '../editor/snap-axis';
import { MIN_ZOOM } from './ruler.constants';
import type { RulerSpan } from './ruler.type';

const axisFromRuler = (at: number, span: RulerSpan, linesOnly: boolean): number =>
  snapAxis((at - span.origin) / Math.max(MIN_ZOOM, span.zoom), span.count, linesOnly);

export { axisFromRuler };
