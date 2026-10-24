/* @layer renderer-app @kind logic */
import { IMPORT_TEXT } from './image-import.constants';

const slicingLine = (names: readonly string[]): string =>
  IMPORT_TEXT.willCreate(names.length, names[0] ?? '', names[names.length - 1] ?? '');

export { slicingLine };
