/* @layer renderer-app @kind logic */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { limitError } from '../palette-limit/limit-error';
import { SOURCE_TEXT } from '../palette-source/palette-source.constants';
import { nameError } from '../sprite-name/name-error';
import { IMPORT_TEXT } from './image-import.constants';
import type { ErrorInput, ImportErrors, ImportForm } from './image-import.type';
import { sliceError } from './slice-error';
import { takenNames } from './taken-names';

const takenIn = ({ form, context }: ErrorInput): readonly string[] => (form.target === 'file' ? takenNames(form.kind, context) : []);

const nameIssue = (input: ErrorInput): string | null =>
  input.form.kind === 'sheet' ? null : nameError(input.form.name, takenIn(input));

const sizeIssue = ({ form, image }: ErrorInput): string | null =>
  form.kind === 'sprite' && (image.width > MAX_SPRITE_SIZE || image.height > MAX_SPRITE_SIZE)
    ? IMPORT_TEXT.tooLarge(image.width, image.height)
    : null;

const namingIssue = (input: ErrorInput): string | null => {
  if (input.form.kind !== 'sheet') return null;
  const taken = takenIn(input);
  return input.names.map((name) => nameError(name, taken)).find((message) => message !== null) ?? null;
};

const makesBank = (form: ImportForm): boolean => form.target === 'new' || form.reduce === 'extract' || form.reduce === 'palette';

const importErrors = (input: ErrorInput): ImportErrors => {
  const { form, rects } = input;
  return {
    name: nameIssue(input),
    size: sizeIssue(input),
    limit: makesBank(form) ? limitError(form.limit) : null,
    palette: form.reduce === 'palette' && form.source.kind === 'file' && form.source.file === null ? SOURCE_TEXT.choose : null,
    slice: form.kind === 'sheet' ? sliceError(form.slice, rects.length) : null,
    naming: namingIssue(input),
  };
};

export { importErrors };
