/* @layer renderer-app @kind logic */
import type { FileKind } from '@bxel/project';

const exportKindOf = (format: unknown): FileKind => {
  if (format === 'gif') return 'gif';
  return format === 'atlas-json' ? 'sheet' : 'png';
};

export { exportKindOf };
