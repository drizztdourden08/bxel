/* @layer renderer-app @kind logic */
import { DIRECT } from './direct-commands.constants';
import type { Direct } from './direct-commands.type';

const directOf = (id: string): Direct | null => (Object.hasOwn(DIRECT, id) ? (DIRECT[id] ?? null) : null);

export { directOf };
