/* @layer renderer-app @kind logic */
import type { LayerFlag } from '../../../editor/layer-flag.type';

const sweepIdOf = (flag: LayerFlag, key: string): string | null => (key.startsWith(`${flag}:`) ? key.slice(flag.length + 1) : null);

export { sweepIdOf };
