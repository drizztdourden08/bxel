/* @layer renderer-app @kind logic */
import type { FileOutcome } from './files.type';

const failed = (message: string): FileOutcome => ({ kind: 'failed', message });

export { failed };
