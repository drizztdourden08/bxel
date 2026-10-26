/* @layer renderer-app @kind constants */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { FILE_COMMAND } from '../../../files/files.constants';

const STRIP_ENTRIES: readonly ContextMenuEntry[] = [FILE_COMMAND.saveAll, FILE_COMMAND.open];

export { STRIP_ENTRIES };
