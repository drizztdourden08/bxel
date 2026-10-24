/* @layer renderer-app @kind logic */
import { CANVAS_DEFAULTS, SURROUND_KINDS } from './canvas-look.constants';
import type { SurroundKind } from './canvas-look.type';

const surroundKindOf = (value: string): SurroundKind => SURROUND_KINDS.find((kind) => kind === value) ?? CANVAS_DEFAULTS.surroundPattern;

export { surroundKindOf };
