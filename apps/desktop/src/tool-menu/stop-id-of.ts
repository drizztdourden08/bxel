/* @layer renderer-app @kind logic */
import { STOP_ATTRIBUTE } from './stop-id-of.constants';
import { stopOf } from './stop-of';

const stopIdOf = (target: EventTarget | null): string | null => stopOf(target)?.getAttribute(STOP_ATTRIBUTE) ?? null;

export { stopIdOf };
