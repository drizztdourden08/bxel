/* @layer renderer-app @kind logic */
import type { RulerSpan } from './ruler.type';

const spanAlong = (at: number, span: RulerSpan): number => (span.reversed === true ? span.length - at : at);

export { spanAlong };
