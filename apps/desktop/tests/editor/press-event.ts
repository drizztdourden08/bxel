/* @layer renderer-app @kind test */
import type { PressEvent } from '../../src/editor/press-plan.type';

const press = (button: number, held: Partial<PressEvent> = {}): PressEvent => ({ button, altKey: false, shiftKey: false, ...held });

export { press };
