/* @layer renderer-app @kind types */
import type { ShortcutKey } from '@drizztdourden08/tessera';

type KeysOf = (command: string | undefined) => ShortcutKey[] | undefined;

export type { KeysOf };
