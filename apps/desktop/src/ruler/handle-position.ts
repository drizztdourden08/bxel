/* @layer renderer-app @kind logic */
import type { RulerSpan } from './ruler.type';

const handlePosition = (doubled: number, span: RulerSpan): number => span.origin + (doubled / 2) * span.zoom;

export { handlePosition };
