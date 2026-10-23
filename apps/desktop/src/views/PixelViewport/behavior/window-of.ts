/* @layer renderer-app @kind logic */
import { documentOf } from './document-of';

const windowOf = (node: Node | null | undefined): Window => documentOf(node).defaultView ?? window;

export { windowOf };
