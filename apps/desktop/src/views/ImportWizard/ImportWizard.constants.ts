/* @layer renderer-app @kind constants */
import { IMPORT_TEXT } from '../../image-import/image-import.constants';
import type { ChoiceOption, ImportKind, ImportTarget, SliceOrder } from '../../image-import/image-import.type';

const TARGET_OPTIONS: ChoiceOption<ImportTarget>[] = [
  { value: 'new', label: IMPORT_TEXT.newFile },
  { value: 'file', label: IMPORT_TEXT.thisFile },
];

const KIND_OPTIONS: ChoiceOption<ImportKind>[] = [
  { value: 'sprite', label: IMPORT_TEXT.sprite },
  { value: 'sheet', label: IMPORT_TEXT.sheet },
  { value: 'strip', label: IMPORT_TEXT.animationKind },
];

const ORDER_OPTIONS: ChoiceOption<SliceOrder>[] = [
  { value: 'rows', label: IMPORT_TEXT.rowsOrder },
  { value: 'columns', label: IMPORT_TEXT.columnsOrder },
];

const ALPHA_RANGE = { min: 0, max: 100, step: 5 } as const;

const OFFSET_MAX = 4096;

const SLICE_PAINT = {
  maxSide: 384,
  minFont: 8,
  maxFont: 14,
  pad: 2,
  fontShare: 3,
  tokens: { sunken: '--c-sunken', line: '--c-primary', text: '--c-text' },
} as const;

export { ALPHA_RANGE, KIND_OPTIONS, OFFSET_MAX, ORDER_OPTIONS, SLICE_PAINT, TARGET_OPTIONS };
