/* @layer renderer-app @kind test */
import type { SpriteId } from '@bxel/document';
import { idOf } from '../sheet/sheet-harness';

const idsOf = (...names: string[]): SpriteId[] => names.map(idOf);

export { idsOf };
