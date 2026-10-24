/* @layer renderer-app @kind logic */
import { baseName } from '../files/base-name';
import { freeName } from '../sheet/free-name';
import { SHEET_NAME } from '../sheet/sheet.constants';
import type { ImportRun } from './image-import.type';

const sheetNameOf = (run: ImportRun): string => {
  const stem = baseName(run.image.fileName).trim();
  return freeName(stem === '' ? SHEET_NAME : stem, run.context.sheetNames);
};

export { sheetNameOf };
