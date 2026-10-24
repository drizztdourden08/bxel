/* @layer renderer-app @kind logic */
import { numberedNames } from '../sprite-name/numbered-names';
import type { ImportForm, SliceRect } from './image-import.type';

const importNames = (form: ImportForm, rects: readonly SliceRect[]): string[] =>
  form.kind === 'sheet' ? numberedNames(form.slice.names.trim(), rects.length) : [form.name.trim()];

export { importNames };
