/* @layer renderer-app @kind logic */
import type { FileKind } from '@bxel/project';
import { SAVE_KINDS } from './save-kind.constants';

const saveKindOf = (name: string): FileKind => SAVE_KINDS.find((kind) => name.toLowerCase().endsWith(`.${kind}`)) ?? 'bxsprite';

export { saveKindOf };
