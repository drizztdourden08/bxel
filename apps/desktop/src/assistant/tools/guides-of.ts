/* @layer renderer-app @kind logic */
import type { Guides } from '@bxel/document';

const guidesOf = (guides: Guides | undefined) => ({ x: [...(guides?.x ?? [])], y: [...(guides?.y ?? [])] });

export { guidesOf };
