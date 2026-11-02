/* @layer renderer-app @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import type { LibraryAction } from './brush-library-run.type';

const COMMAND_OF: Readonly<Record<LibraryAction['kind'], Readonly<Record<LibraryAction['action'], string>>>> = {
  brush: { rename: COMMAND_NAME.brushUpdate, remove: COMMAND_NAME.brushDelete },
  pattern: { rename: COMMAND_NAME.patternUpdate, remove: COMMAND_NAME.patternDelete },
};

const LABEL_OF: Readonly<Record<LibraryAction['kind'], Readonly<Record<LibraryAction['action'], string>>>> = {
  brush: { rename: 'Rename brush', remove: 'Delete brush' },
  pattern: { rename: 'Rename pattern', remove: 'Delete pattern' },
};

export { COMMAND_OF, LABEL_OF };
