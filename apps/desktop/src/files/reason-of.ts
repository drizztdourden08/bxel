/* @layer renderer-app @kind logic */
import { FILE_TEXT, REASON_PREFIX } from './files.constants';

const reasonOf = (error: unknown): string =>
  error instanceof Error && error.message !== '' ? error.message.replace(REASON_PREFIX, '') : FILE_TEXT.unknownReason;

export { reasonOf };
